import { Currency, SWAP_SERVICE_NAME, SwapServiceClient } from '@bitsacco/common/types';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

@Injectable()
export class SwapService implements OnModuleInit {
  private client: SwapServiceClient;

  constructor(@Inject(SWAP_SERVICE_NAME) private readonly grpc: ClientGrpc) {
  }

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

  postOnrampTransaction() {
    return { status: 200 };
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
