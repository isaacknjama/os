import { Injectable, Logger } from '@nestjs/common';
import {
  btcFromKes,
  FindSwapRequest,
  OnrampSwapRequest,
  OnrampSwapResponse,
  QuoteRequest,
  QuoteResponse,
} from '@bitsacco/common';
import { v4 as uuidv4 } from 'uuid';
import { FxService } from './fx/fx.service';

@Injectable()
export class SwapService {
  private readonly logger = new Logger(SwapService.name);

  constructor(private readonly fxService: FxService) {
    this.logger.log('SwapService initialized');
  }

  async getQuote({ from, to, amount }: QuoteRequest): Promise<QuoteResponse> {
    try {
      const btcToKesRate = await this.fxService.getBtcToKesRate();

      if (amount && isNaN(Number(amount))) {
        throw new Error('Amount must be a number');
      }

      const amountBtc =
        amount && btcFromKes({ amountKes: Number(amount), btcToKesRate });
      const expiry = Math.floor(Date.now() / 1000) + 30 * 60;

      return {
        id: uuidv4(),
        from,
        to,
        rate: btcToKesRate.toString(),
        amount: amountBtc?.toString(),
        expiry: expiry.toString(),
      };
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async createOnrampSwap({
    quote,
    phone,
    amount,
  }: OnrampSwapRequest): Promise<OnrampSwapResponse> {
    return Promise.reject('Not implemented');
  }

  async findOnrampSwap({ id }: FindSwapRequest): Promise<OnrampSwapResponse> {
    return Promise.reject('Not implemented');
  }
}
