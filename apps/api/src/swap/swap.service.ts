import {
  Currency,
  OnrampSwapRequest,
  SWAP_SERVICE_NAME,
  SwapServiceClient,
} from '@bitsacco/common';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { type ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class SwapService implements OnModuleInit {
  private client: SwapServiceClient;

  constructor(@Inject(SWAP_SERVICE_NAME) private readonly grpc: ClientGrpc) {}

  onModuleInit() {
    this.client = this.grpc.getService<SwapServiceClient>(SWAP_SERVICE_NAME);
  }

  getOnrampQuote(req: {
    from: Currency.KES;
    to: Currency.BTC;
    amount?: string;
  }) {
    return this.client.getQuote(req);
  }

  postOnrampTransaction(req: OnrampSwapRequest) {
    return this.client.createOnrampSwap(req);
  }

  getOnrampTransactions() {
    return { status: 200 };
  }

  findOnrampTransaction() {
    return { status: 200 };
  }

  getOfframpQuote() {
    return { status: 200 };
  }

  postOfframpTransaction() {
    return { status: 200 };
  }

  getOfframpTransactions() {
    return { status: 200 };
  }

  findOfframpTransaction() {
    return { status: 200 };
  }

  postSwapUpdate() {
    return { status: 200 };
  }
}
