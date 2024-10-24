import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  Logger,
  Post,
  Query,
} from '@nestjs/common';
import { SwapService } from './swap.service';
import {
  Currency,
  mapToCurrency,
  type SupportedCurrencyType,
  SupportedCurrencies,
  process_swap_update,
  EVENTS_SERVICE_BUS
} from '@bitsacco/common';
import { ClientProxy } from '@nestjs/microservices';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';

@Controller('swap')
export class SwapController {
  private readonly logger = new Logger(SwapController.name);

  constructor(
    private readonly swapService: SwapService,
    @Inject(EVENTS_SERVICE_BUS) private readonly eventsClient: ClientProxy
  ) {
    this.logger.log('SwapController initialized');
  }

  @Get('onramp/quote')
  @ApiOperation({ summary: 'Get onramp quote' })
  @ApiQuery({ name: 'currency', enum: SupportedCurrencies, required: true })
  @ApiQuery({ name: 'amount', type: Number, required: false })
  getOnrampQuote(
    @Query('currency') currency: SupportedCurrencyType,
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
    this.eventsClient.emit(process_swap_update, {});
    return { success: true };
  }
}
