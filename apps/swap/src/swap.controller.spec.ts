import {
  Currency,
  SwapStatus,
  btcFromKes,
  createTestingModuleWithValidation,
} from '@bitsacco/common';
import { TestingModule } from '@nestjs/testing';
import { SwapController } from './swap.controller';
import { PrismaService } from './prisma.service';
import { SwapService } from './swap.service';
import { FxService } from './fx/fx.service';
import { IntasendService } from './intasend/intasend.service';
import { CreateOnrampSwapDto } from './dto';

const mock_rate = 8708520.117232416;

describe('SwapController', () => {
  let swapController: SwapController;
  let prismaService: PrismaService;
  let mockCacheManager: {
    get: jest.Mock;
    set: jest.Mock;
  };

  beforeEach(async () => {
    mockCacheManager = {
      get: jest.fn(),
      set: jest.fn(),
    };

    const app: TestingModule = await createTestingModuleWithValidation({
      imports: [],
      controllers: [SwapController],
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
          useValue: {
            sendStkPush: jest.fn().mockResolvedValue({
              id: '123456789',
              invoice: {
                invoice_id: '123456789',
              },
              refundable: false,
            }),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            $connect: jest.fn(),
          },
        },
        {
          provide: 'CACHE_MANAGER',
          useValue: mockCacheManager,
        },
      ],
    });

    swapController = app.get<SwapController>(SwapController);
    prismaService = app.get<PrismaService>(PrismaService);
  });

  describe('root', () => {
    it('should be defined', () => {
      expect(swapController).toBeDefined();
    });
  });

  describe('getQuote', () => {
    const req = {
      from: Currency.KES,
      to: Currency.BTC,
    };

    it('should return a quote', async () => {
      const quote = await swapController.getQuote(req);

      expect(quote).toBeDefined();
    });

    it('should return a quote with a valid expiry of more than 10 minutes', async () => {
      const quote = await swapController.getQuote(req);
      const tenMinsFuture = Math.floor(Date.now() / 1000) + 10 * 60;

      expect(quote.expiry).toBeDefined();
      expect(Number(quote.expiry)).toBeGreaterThanOrEqual(tenMinsFuture);
      expect(mockCacheManager.set).toHaveBeenCalled();
    });

    it('should return a quote with amount, if amount is declared', async () => {
      const amount = '100';
      const quote = await swapController.getQuote({
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
        swapController.getQuote({
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

      (mockCacheManager.get as jest.Mock).mockImplementation(
        (key: string) => cache,
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

      const swap = await swapController.createOnrampSwap(req);

      expect(swap).toBeDefined();
      expect(swap.rate).toEqual(cache.rate);
      expect(swap.status).toEqual(SwapStatus.PENDING);
      expect(mockCacheManager.set).toHaveBeenCalled();
    });
  });

  describe('findOnrampSwap', () => {
    it('should return a known swap is in cache', async () => {
      const cache = {
        lightning: 'lnbtcexampleinvoicee',
        phone: '0700000000',
        amount: '100',
        rate: mock_rate.toString(),
        ref: 'test-onramp-swap',
      };

      (mockCacheManager.get as jest.Mock).mockImplementation(
        (key: string) => cache,
      );

      const swap = await swapController.findOnrampSwap({
        id: 'dadad-bdjada-dadad',
      });

      expect(swap).toBeDefined();
      expect(swap.rate).toEqual(cache.rate);
      expect(swap.status).toEqual(SwapStatus.PENDING);
    });

    it('should throw an error if swap is unknown', async () => {
      expect(
        swapController.findOnrampSwap({
          id: 'dadad-bdjada-dadad',
        }),
      ).rejects.toThrow('Swap not found');
    });

    // TODO: Verify find swap already persisted to DB
  });
});
