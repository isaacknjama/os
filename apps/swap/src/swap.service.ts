import {
  btcFromKes,
  Currency,
  FindSwapRequest,
  OnrampSwapResponse,
  QuoteRequest,
  QuoteResponse,
  SwapStatus,
} from '@bitsacco/common';
import { v4 as uuidv4 } from 'uuid';
import type { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { FxService } from './fx/fx.service';
import { PrismaService } from './prisma.service';
import { IntasendService } from './intasend/intasend.service';
import { CreateOnrampSwapDto } from './dto';

@Injectable()
export class SwapService {
  private readonly logger = new Logger(SwapService.name);
  private readonly CACHE_TTL_SECS = 1800;

  constructor(
    private readonly fxService: FxService,
    private readonly intasendService: IntasendService,
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
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
      const expiry = Math.floor(Date.now() / 1000) + 30 * 60; // 30 mins from now

      const quote: QuoteResponse = {
        id: uuidv4(),
        from,
        to,
        rate: btcToKesRate.toString(),
        amount: amountBtc?.toString(),
        expiry: expiry.toString(),
      };

      this.cacheManager.set(quote.id, quote, this.CACHE_TTL_SECS);

      return quote;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async createOnrampSwap({
    quote,
    ref,
    amount,
    phone,
    lightning,
  }: CreateOnrampSwapDto): Promise<OnrampSwapResponse> {
    let currentQuote = quote && this.cacheManager.get(quote.id);

    if (
      !currentQuote ||
      (Date.now() / 1000 > Number(currentQuote.expiry) &&
        quote.refreshIfExpired)
    ) {
      // create or refresh quote
      currentQuote = await this.getQuote({
        from: Currency.KES,
        to: Currency.BTC,
        amount,
      });
    }

    const resp = await this.intasendService.sendStkPush({
      amount: Number(amount),
      phone_number: phone,
      api_ref: ref,
    });

    // We record stk push response to a temporary cache
    // so we can track status of the swap later
    this.cacheManager.set(
      resp.id,
      {
        lightning,
        phone,
        amount,
        rate: currentQuote.rate,
        ref,
      },
      this.CACHE_TTL_SECS,
    );

    // TODO: return stream of responses with every status change?
    return {
      id: resp.id,
      rate: currentQuote.rate,
      status: SwapStatus.PENDING,
    };
  }

  async findOnrampSwap({ id }: FindSwapRequest): Promise<OnrampSwapResponse> {
    return Promise.reject('Not implemented');
  }
}
