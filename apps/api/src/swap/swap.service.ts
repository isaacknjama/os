import { Injectable } from '@nestjs/common';

@Injectable()
export class SwapService {
  getOnrampQuote() {
    return { status: 200 };
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
