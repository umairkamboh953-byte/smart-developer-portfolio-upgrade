import { CurrencyCode, CurrencyConfig } from '../types';

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  PKR: {
    code: 'PKR',
    symbol: '₨',
    name: 'Pakistani Rupee',
    rateAgainstUSD: 278.5,
  },
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

export function formatPrice(priceUSD: number, currency: CurrencyCode, pricePKR?: number): string {
  if (currency === 'PKR') {
    const val = pricePKR && pricePKR > 0 ? pricePKR : Math.round(priceUSD * 278.5);
    return `₨ ${val.toLocaleString('en-US')}`;
  }

  const cfg = CURRENCIES[currency] || CURRENCIES.PKR;
  const converted = priceUSD * cfg.rateAgainstUSD;
  return `${cfg.symbol}${Math.round(converted).toLocaleString('en-US')}`;
}

export function convertAmount(priceUSD: number, currency: CurrencyCode, pricePKR?: number): number {
  if (currency === 'PKR') {
    return pricePKR && pricePKR > 0 ? pricePKR : Math.round(priceUSD * 278.5);
  }
  const cfg = CURRENCIES[currency] || CURRENCIES.PKR;
  return Math.round(priceUSD * cfg.rateAgainstUSD);
}
