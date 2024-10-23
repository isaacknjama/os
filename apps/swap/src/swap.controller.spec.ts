import { Currency, btcFromKes } from '@bitsacco/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SwapController } from './swap.controller';
import { SwapService } from './swap.service';
import { FxService } from './fx/fx.service';

const mock_rate = 8708520.117232416;

describe('SwapController', () => {
  let swapController: SwapController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
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
      ],
    }).compile();

    swapController = app.get<SwapController>(SwapController);
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
    it('should create an onramp swap', async () => {
      expect(
        swapController.createOnrampSwap({
          quote: {
            id: 'dadad-bdjada-dadad',
            refreshIfExpired: false,
          },
          phone: 'phone',
          amount: '100',
        }),
      ).rejects.toThrow('Not implemented');
    });
  });

  describe('findOnrampSwap', () => {
    it('should find an onramp swap', async () => {
      expect(
        swapController.findOnrampSwap({
          id: 'dadad-bdjada-dadad',
        }),
      ).rejects.toThrow('Not implemented');
    });
  });
});
