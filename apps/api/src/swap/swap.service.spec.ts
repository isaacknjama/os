import { ConfigService } from '@nestjs/config';
import { TestingModule } from '@nestjs/testing';
import { ClientGrpc } from '@nestjs/microservices';
import {
  btcFromKes,
  createTestingModuleWithValidation,
  Currency,
  type QuoteRequest,
  type QuoteResponse,
  SWAP_SERVICE_NAME,
  SwapServiceClient,
} from '@bitsacco/common';
import { SwapService } from './swap.service';

describe('SwapService', () => {
  let service: SwapService;
  let mockClientGrpc: ClientGrpc;
  let mockSSC: Partial<SwapServiceClient>;

  const mock_id = '6f7f6d3f-c54e-4a34-a80d-a9e3c023abf3';
  const mock_rate = 8708520.117232416; // BTC to KES

  beforeAll(() => {
    // gRpc client that actually talks to the microservice
    mockSSC = {
      // Add any methods from SwapServiceClient that you need to mock
      getQuote: jest
        .fn()
        .mockImplementation(
          ({ from, to, amount }: QuoteRequest): QuoteResponse => {
            return {
              id: mock_id,
              from,
              to,
              amount: btcFromKes({
                amountKes: Number(amount),
                btcToKesRate: mock_rate,
              }).toString(),
              expiry: (Math.floor(Date.now() / 1000) + 30 * 60).toString(),
              rate: mock_rate.toString(),
            };
          },
        ),
    };
  });

  beforeEach(async () => {
    mockClientGrpc = {
      getService: jest.fn().mockReturnValue(mockSSC),
      getClientByServiceName: jest.fn().mockReturnValue(mockSSC),
    };

    const module: TestingModule = await createTestingModuleWithValidation({
      providers: [
        ConfigService,
        {
          provide: SwapService,
          useFactory: () => {
            const real = new SwapService(mockClientGrpc);
            real.onModuleInit();
            return real;
          },
        },
        {
          provide: SWAP_SERVICE_NAME,
          useValue: mockClientGrpc,
        },
      ],
    });

    service = module.get<SwapService>(SwapService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOnrampQuote', () => {
    it('should return a valid quote', () => {
      const quote = service.getOnrampQuote({
        from: Currency.KES,
        to: Currency.BTC,
        amount: '1',
      });
      expect(quote).toBeDefined();
    });
  });

  describe('postOnrampTransaction', () => {
    it('should return status 200', () => {
      expect(service.postOnrampTransaction()).toEqual({ status: 200 });
    });
  });

  describe('getOnrampTransactions', () => {
    it('should return status 200', () => {
      expect(service.getOnrampTransactions()).toEqual({ status: 200 });
    });
  });

  describe('findOnrampTransaction', () => {
    it('should return status 200', () => {
      expect(service.findOnrampTransaction()).toEqual({ status: 200 });
    });
  });

  describe('getOfframpQuote', () => {
    it('should return status 200', () => {
      expect(service.getOfframpQuote()).toEqual({ status: 200 });
    });
  });

  describe('postOfframpTransaction', () => {
    it('should return status 200', () => {
      expect(service.postOfframpTransaction()).toEqual({ status: 200 });
    });
  });

  describe('getOfframpTransactions', () => {
    it('should return status 200', () => {
      expect(service.getOfframpTransactions()).toEqual({ status: 200 });
    });
  });

  describe('findOfframpTransaction', () => {
    it('should return status 200', () => {
      expect(service.findOfframpTransaction()).toEqual({ status: 200 });
    });
  });

  describe('postSwapUpdate', () => {
    it('should return status 200', () => {
      expect(service.postSwapUpdate()).toEqual({ status: 200 });
    });
  });
});
