import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  Post,
  Query,
} from '@nestjs/common';
import { SwapService } from './swap.service';
import { Currency, mapToCurrency } from '@bitsacco/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { SupportedCurrencies } from '@bitsacco/common';

@Controller('swap')
export class SwapController {
  private readonly logger = new Logger(SwapController.name);

  constructor(
    private readonly swapService: SwapService
  ) {
    this.logger.log('SwapController initialized');
  }

  @Get('onramp/quote')
  @ApiOperation({ summary: 'Get onramp quote' })
  @ApiQuery({ name: 'currency', enum: SupportedCurrencies, required: true })
  @ApiQuery({ name: 'amount', type: Number, required: false })
  getOnrampQuote(
    @Query('currency') currency: SupportedCurrencies,
    @Query('amount') amount?: number,
  ) {
    const from = mapToCurrency(currency);
    if (from !== Currency.KES) {
      const es = 'Invalid currency. Only KES is supported';
      this.logger.error(es);
      throw new BadRequestException(es);
    }

    return this.swapService.getOnrampQuote({
      from,
      to: Currency.BTC,
      amount: amount?.toString(),
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
