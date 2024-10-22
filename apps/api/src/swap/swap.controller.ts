import { Controller, Get, Post, Query } from '@nestjs/common';
import { SwapService } from './swap.service';
import { Currency } from '@bitsacco/common';

@Controller('swap')
export class SwapController {
  constructor(private readonly swapService: SwapService) {}

  @Get('onramp/quote')
  getOnrampQuote(
    @Query('currency') currency: Currency,
    @Query('amount') amount?: string,
  ) {
    if (currency !== Currency.KES) {
      throw new Error('Invalid currency. Only KES is supported');
    }

    return this.swapService.getOnrampQuote({
      from: currency,
      to: Currency.BTC,
      amount,
    });
  }

  @Post('onramp')
  postOnrampTransaction() {
    return this.swapService.postOnrampTransaction();
  }

  @Get('onramp/all')
  getOnrampTransactions() {
    return this.swapService.getOnrampTransactions();
  }

  @Get('onramp/find/:id')
  findOnrampTransaction() {
    return this.swapService.findOnrampTransaction();
  }

  @Get('offramp/quote')
  getOfframpQuote() {
    return this.swapService.getOfframpQuote();
  }

  @Post('offramp')
  postOfframpTransaction() {
    return this.swapService.postOfframpTransaction();
  }

  @Get('offramp/all')
  getOfframpTransactions() {
    return this.swapService.getOfframpTransactions();
  }

  @Get('offramp/find/:id')
  findOfframpTransaction() {
    return this.swapService.findOfframpTransaction();
  }

  @Post('update')
  postSwapUpdate() {
    return this.swapService.postSwapUpdate();
  }
}
