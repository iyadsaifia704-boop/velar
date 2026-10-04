import { Currency } from '../types';

export function formatPrice(amountDZD: number, currency: Currency = 'DZD', language: string = 'ar'): string {
  if (currency === 'EUR') {
    const eurAmount = Math.round(amountDZD / 150);
    return `${eurAmount} €`;
  }
  if (currency === 'USD') {
    const usdAmount = Math.round(amountDZD / 138);
    return `$${usdAmount}`;
  }

  // DZD
  const formatted = amountDZD.toLocaleString(language === 'ar' ? 'ar-DZ' : 'en-US');
  if (language === 'ar') {
    return `${formatted} د.ج`;
  }
  return `${formatted} DZD`;
}
