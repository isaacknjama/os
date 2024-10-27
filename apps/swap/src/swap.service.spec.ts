import {
  btcFromKes,
  createTestingModuleWithValidation,
  Currency,
  SwapStatus,
} from '@bitsacco/common';
import { TestingModule } from '@nestjs/testing';
import { FxService } from './fx/fx.service';
import { SwapService } from './swap.service';
import { PrismaService } from './prisma.service';
import { SwapTransactionState } from '.prisma/client';
import { IntasendService } from './intasend/intasend.service';
import { MpesaTractactionState } from './intasend/intasend.types';
import { CreateOnrampSwapDto, MpesaTransactionUpdateDto } from './dto';

const mock_rate = 8708520.117232416;

describe('SwapService', () => {
  let swapService: SwapService;
  let mockPrismaService: PrismaService;
  let mockIntasendService: IntasendService;
  let mockCacheManager: {
    get: jest.Mock;
    set: jest.Mock;
    getOrThrow: jest.Mock;
  };

  beforeEach(async () => {
    mockCacheManager = {
      get: jest.fn(),
      getOrThrow: jest.fn(),
      set: jest.fn(),
    };

    mockPrismaService = {
      $connect: jest.fn(),
      mpesaOnrampSwap: {
        create: jest.fn().mockImplementation(() => ({
          id: 'dadad-bdjada-dadad',
          state: SwapTransactionState.PENDING,
          rate: mock_rate.toString(),
        })),
        findUniqueOrThrow: jest.fn().mockImplementation(() => {
          throw 'error';
        }),
        update: jest.fn().mockImplementation(() => ({
          id: 'dadad-bdjada-dadad',
          state: SwapTransactionState.PENDING,
          rate: mock_rate.toString(),
        })),
      },
    } as unknown as PrismaService;

    mockIntasendService = {
      sendMpesaStkPush: jest.fn().mockImplementation(() => ({
        id: '123456789',
        invoice: {
          invoice_id: '123456789',
        },
        refundable: false,
      })),
      updateMpesaTx: jest.fn().mockResolvedValue({
        id: '123456789',
        invoice: {
          invoice_id: '123456789',
        },
        refundable: false,
      }),
    } as unknown as IntasendService;

    const app: TestingModule = await createTestingModuleWithValidation({
      imports: [],
      controllers: [],
      providers: [
        SwapService,
        {
          provide: FxService,
          useValue: {
            getBtcToKesRate: jest.fn().mockResolvedValue(mock_rate),
          },
        },
        {
          provide: IntasendService,
          useValue: mockIntasendService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: 'CACHE_MANAGER',
          useValue: mockCacheManager,
        },
      ],
    });

    swapService = app.get<SwapService>(SwapService);
  });

  describe('root', () => {
    it('should be defined', () => {
      expect(swapService).toBeDefined();
    });
  });

  describe('getQuote', () => {
    const req = {
      from: Currency.KES,
      to: Currency.BTC,
    };

    it('should return a quote', async () => {
      const quote = await swapService.getQuote(req);

      expect(quote).toBeDefined();
    });

    it('should return a quote with a valid expiry of more than 10 minutes', async () => {
      const quote = await swapService.getQuote(req);
      const tenMinsFuture = Math.floor(Date.now() / 1000) + 10 * 60;

      expect(quote.expiry).toBeDefined();
      expect(Number(quote.expiry)).toBeGreaterThanOrEqual(tenMinsFuture);
      expect(mockCacheManager.set).toHaveBeenCalled();
    });

    it('should return a quote with amount, if amount is declared', async () => {
      const amount = '100';
      const quote = await swapService.getQuote({
        ...req,
        amount,
      });

      expect(quote).toBeDefined();
      expect(quote.amount).toBeDefined();
      expect(quote.amount).toEqual(
        btcFromKes({ amountKes: Number(amount), btcToKesRate: mock_rate }),
      );
      expect(mockCacheManager.set).toHaveBeenCalled();
    });

    it('should throw an error if amount is not a number string', async () => {
      const amount = 'nan';
      expect(
        swapService.getQuote({
          ...req,
          amount,
        }),
      ).rejects.toThrow('Amount must be a number');
    });
  });

  describe('createOnrampSwap', () => {
    it('should create an onramp swap with expected fx rate', async () => {
      const cache = {
        lightning: 'lnbtcexampleinvoicee',
        phone: '0700000000',
        amount: '100',
        rate: mock_rate.toString(),
        ref: 'test-onramp-swap',
      };

      (mockCacheManager.getOrThrow as jest.Mock).mockImplementation(
        (_key: string) => cache,
      );

      const req: CreateOnrampSwapDto = {
        quote: {
          id: 'dadad-bdjada-dadad',
          refreshIfExpired: false,
        },
        ref: 'test-onramp-swap',
        phone: cache.phone,
        amount: cache.amount,
        lightning: cache.lightning,
      };

      const swap = await swapService.createOnrampSwap(req);

      expect(swap).toBeDefined();
      expect(swap.rate).toEqual(cache.rate);
      expect(swap.status).toEqual(SwapStatus.PENDING);
      expect(mockCacheManager.set).toHaveBeenCalled();
    });
  });

  describe('findOnrampSwap', () => {
    it('should lookup a swap in db', async () => {
      expect(
        swapService.findOnrampSwap({
          id: 'dadad-bdjada-dadad',
        }),
      ).rejects.toThrow('Swap not found in db or cache');
      expect(
        mockPrismaService.mpesaOnrampSwap.findUniqueOrThrow,
      ).toHaveBeenCalled();
    });

    it('should look up swap in cache if swap is not in db', async () => {
      const cache = {
        lightning: 'lnbtcexampleinvoicee',
        phone: '0700000000',
        amount: '100',
        rate: mock_rate.toString(),
        ref: 'test-onramp-swap',
        state: MpesaTractactionState.Pending,
      };

      (mockCacheManager.getOrThrow as jest.Mock).mockImplementation(
        (_key: string) => cache,
      );

      const swap = await swapService.findOnrampSwap({
        id: 'dadad-bdjada-dadad',
      });

      expect(swap).toBeDefined();
      expect(swap.rate).toEqual(cache.rate);
      expect(swap.status).toEqual(SwapStatus.PENDING);
      expect(mockCacheManager.getOrThrow).toHaveBeenCalled();
    });
  });

  describe('processSwapUpdate', () => {
    it('should update mpesa tx', async () => {
      const cache = {
        lightning: 'lnbtcexampleinvoicee',
        phone: '0700000000',
        amount: '100',
        rate: mock_rate.toString(),
        ref: 'test-onramp-swap',
        state: MpesaTractactionState.Pending,
      };

      (mockCacheManager.getOrThrow as jest.Mock).mockImplementation(
        (_key: string) => cache,
      );

      const req: MpesaTransactionUpdateDto = {
        invoice_id: '123456789',
        state: MpesaTractactionState.Complete,
        charges: '1',
        net_amount: '99',
        currency: 'KES',
        value: '100',
        account: '0700000000',
        api_ref: 'mpesa-onramp',
        retry_count: 0,
        created_at: '2021-08-01T00:00:00Z',
        updated_at: '2024-10-01T00:00:00Z',
        failed_reason: null,
        failed_code: null,
        challenge: 'BITSACCO-TEST',
      };
      await swapService.processSwapUpdate(req);
      expect(mockIntasendService.updateMpesaTx).toHaveBeenCalled();
      expect(mockCacheManager.getOrThrow).toHaveBeenCalled();
      expect(
        mockPrismaService.mpesaOnrampSwap.findUniqueOrThrow,
      ).toHaveBeenCalled();
      expect(mockPrismaService.mpesaOnrampSwap.create).toHaveBeenCalled();
      expect(mockPrismaService.mpesaOnrampSwap.update).toHaveBeenCalled();
    });
  });
});
