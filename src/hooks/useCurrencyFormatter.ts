import useI18n from 'gigbook/hooks/useI18n';
import { useMemo } from 'react';

export class CurrencyFormatter extends Intl.NumberFormat {
  readonly fractionDigits: number;

  constructor(currency: string, locale?: string) {
    super(locale, {
      style: 'currency',
      currency,
    });
    this.fractionDigits = this.resolvedOptions().maximumFractionDigits;
  }
}

export default function useCurrencyFormatter(
  currency?: string,
): CurrencyFormatter | undefined {
  const { locale } = useI18n();
  return useMemo(
    () => (currency ? new CurrencyFormatter(currency, locale) : undefined),
    [currency, locale],
  );
}
