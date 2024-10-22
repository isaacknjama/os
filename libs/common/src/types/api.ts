import { Currency } from "./proto/swap";

export interface OnrampQuoteRequest {
  from: Currency.KES;
  to: Currency.BTC;
  amount?: string;
}