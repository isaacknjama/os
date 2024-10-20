import { Test, TestingModule } from '@nestjs/testing';
import { SwapController } from './swap.controller';
import { SwapService } from './swap.service';

describe('SwapController', () => {
  let controller: SwapController;
  let swapService: SwapService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SwapController],
      providers: [
        {
          provide: SwapService,
          useValue: {
            getOnrampQuote: jest.fn(),
            postOnrampTransaction: jest.fn(),
            getOnrampTransactions: jest.fn(),
            findOnrampTransaction: jest.fn(),
            getOfframpQuote: jest.fn(),
            postOfframpTransaction: jest.fn(),
            getOfframpTransactions: jest.fn(),
            findOfframpTransaction: jest.fn(),
            postSwapUpdate: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SwapController>(SwapController);
    swapService = module.get<SwapService>(SwapService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getOnrampQuote', () => {
    it('should call swapService.getOnrampQuote', () => {
      controller.getOnrampQuote();
      expect(swapService.getOnrampQuote).toHaveBeenCalled();
    });
  });

  describe('postOnrampTransaction', () => {
    it('should call swapService.postOnrampTransaction', () => {
      controller.postOnrampTransaction();
      expect(swapService.postOnrampTransaction).toHaveBeenCalled();
    });
  });

  describe('getOnrampTransactions', () => {
    it('should call swapService.getOnrampTransactions', () => {
      controller.getOnrampTransactions();
      expect(swapService.getOnrampTransactions).toHaveBeenCalled();
    });
  });

  describe('findOnrampTransaction', () => {
    it('should call swapService.findOnrampTransaction', () => {
      controller.findOnrampTransaction();
      expect(swapService.findOnrampTransaction).toHaveBeenCalled();
    });
  });

  describe('getOfframpQuote', () => {
    it('should call swapService.getOfframpQuote', () => {
      controller.getOfframpQuote();
      expect(swapService.getOfframpQuote).toHaveBeenCalled();
    });
  });

  describe('postOfframpTransaction', () => {
    it('should call swapService.postOfframpTransaction', () => {
      controller.postOfframpTransaction();
      expect(swapService.postOfframpTransaction).toHaveBeenCalled();
    });
  });

  describe('getOfframpTransactions', () => {
    it('should call swapService.getOfframpTransactions', () => {
      controller.getOfframpTransactions();
      expect(swapService.getOfframpTransactions).toHaveBeenCalled();
    });
  });

  describe('findOfframpTransaction', () => {
    it('should call swapService.findOfframpTransaction', () => {
      controller.findOfframpTransaction();
      expect(swapService.findOfframpTransaction).toHaveBeenCalled();
    });
  });

  describe('postSwapUpdate', () => {
    it('should call swapService.postSwapUpdate', () => {
      controller.postSwapUpdate();
      expect(swapService.postSwapUpdate).toHaveBeenCalled();
    });
  });
});
