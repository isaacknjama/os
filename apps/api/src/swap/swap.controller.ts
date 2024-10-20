import { Controller, Get, Post } from '@nestjs/common';
import { SwapService } from './swap.service';

@Controller('swap')
export class SwapController {
  constructor(private readonly swapService: SwapService) { }

  @Get('onramp/quote')
  getOnrampQuote() {
    return this.swapService.getOnrampQuote();
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
