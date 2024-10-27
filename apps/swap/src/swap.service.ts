import {
  btcFromKes,
  Currency,
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
import {
  CreateOnrampSwapDto,
  FindSwapDto,
  MpesaTransactionUpdateDto,
} from './dto';
import { MpesaTractactionState } from './intasend/intasend.types';

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

    const { id, state } = await this.intasendService.sendMpesaStkPush({
      amount: Number(amount),
      phone_number: phone,
      api_ref: ref,
    });

    // We record stk push response to a temporary cache
    // so we can track status of the swap later
    this.cacheManager.set(
      id,
      {
        lightning,
        phone,
        amount,
        rate: currentQuote.rate,
        state,
        ref,
      },
      this.CACHE_TTL_SECS,
    );

    return {
      id,
      rate: currentQuote.rate,
      status: SwapStatus.PENDING,
    };
  }

  async findOnrampSwap({ id }: FindSwapDto): Promise<OnrampSwapResponse> {
    let swap;
    try {
      // Look up swap in db
      swap = await this.prismaService.mpesaOnrampSwap.findUniqueOrThrow({
        where: {
          id,
        },
      });
    } catch (_error) {
      this.logger.warn(`Swap not found in DB : ${id}`);
    }

    try {
      // Look up swap in cache
      swap = await this.cacheManager.get(id);
    } catch (_error) {
      this.logger.warn(`Swap not found in cache : ${id}`);
    }

    if (!swap) {
      throw new Error('Swap not found in db or cache');
    }

    return {
      id,
      rate: swap.rate,
      status: mapMpesaTxStateToSwapStatus(swap.state),
    };
  }

  async processSwapUpdate(data: MpesaTransactionUpdateDto) {
    // verify that swap is already recorded in DB
    const swap = await this.prismaService.mpesaOnrampSwap.findUnique({
      where: {
        mpesaId: data.invoice_id,
      },
    });

    // record mpesa transaction using intasend service
    // check status:
    //  - if status has progresed to complete, do the actual swap using fedimint service

    this.logger.log('Processing Swap Update');
    this.logger.log(data);

    return;
  }
}

function mapMpesaTxStateToSwapStatus(state: MpesaTractactionState): SwapStatus {
  switch (state) {
    case MpesaTractactionState.Pending:
      return SwapStatus.PENDING;
    case MpesaTractactionState.Failed:
      return SwapStatus.FAILED;
    case MpesaTractactionState.Complete:
      return SwapStatus.COMPLETE;
    case MpesaTractactionState.Retry:
    case MpesaTractactionState.Processing:
      return SwapStatus.PROCESSING;
  }
}
