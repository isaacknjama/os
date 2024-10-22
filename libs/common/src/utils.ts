import { Currency } from "./types";
import { SupportedCurrencies, SupportedCurrencyKeys } from "./types/api";

export function mapToCurrency(currency: SupportedCurrencies[SupportedCurrencyKeys]): Currency {
  switch (currency) {
    case SupportedCurrencies.KES:
      return Currency.KES;
    case SupportedCurrencies.BTC:
      return Currency.BTC;
    default:
      throw new Error(`Unsupported currency: ${currency}`);
  }
}
