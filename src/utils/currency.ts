import { CurrencyCode, CurrencyConfig } from '../types';

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    rateAgainstUSD: 1.0,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    rateAgainstUSD: 0.78,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    rateAgainstUSD: 0.92,
  },
  PKR: {
    code: 'PKR',
    symbol: '₨',
    name: 'Pakistani Rupee',
    rateAgainstUSD: 278.5,
  },
  CAD: {
    code: 'CAD',
    symbol: 'C$',
    name: 'Canadian Dollar',
    rateAgainstUSD: 1.37,
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    rateAgainstUSD: 1.52,
  },
};

export function formatPrice(priceUSD: number, currency: CurrencyCode): string {
  const cfg = CURRENCIES[currency] || CURRENCIES.USD;
  const converted = priceUSD * cfg.rateAgainstUSD;

  if (currency === 'PKR') {
    return `${cfg.symbol} ${Math.round(converted).toLocaleString('en-US')}`;
  }

  return `${cfg.symbol}${Math.round(converted).toLocaleString('en-US')}`;
}

export function convertAmount(priceUSD: number, currency: CurrencyCode): number {
  const cfg = CURRENCIES[currency] || CURRENCIES.USD;
  return Math.round(priceUSD * cfg.rateAgainstUSD);
}
