import { Currency } from './proto/swap';

export type SupportedCurrencies = Extract<Currency, 'KES' | 'BTC'>;

export const SupportedCurrencies = {
  KES: 'KES' as const,
  BTC: 'BTC' as const,
} as const;

export type SupportedCurrencyKeys = keyof typeof SupportedCurrencies;

export interface OnrampQuoteRequest {
  from: SupportedCurrencies['KES'];
  to: SupportedCurrencies['BTC'];
  amount?: string;
}
