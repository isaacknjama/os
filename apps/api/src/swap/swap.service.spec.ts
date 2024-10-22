import { Test, TestingModule } from '@nestjs/testing';
import { SwapService } from './swap.service';
import { Currency } from '@bitsacco/common/types';

describe('SwapService', () => {
  let service: SwapService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SwapService],
    }).compile();

    service = module.get<SwapService>(SwapService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOnrampQuote', () => {
    it('should return status 200', () => {
      expect(service.getOnrampQuote({
        from: Currency.KES,
        to: Currency.BTC,
        amount: '1',
      })).toEqual({ status: 200 });
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
