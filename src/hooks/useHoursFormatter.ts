import useI18n from 'gigbook/hooks/useI18n';
import { useMemo } from 'react';

const fractionDigits = 2;

export class HoursFormatter extends Intl.NumberFormat {
  readonly fractionDigits = fractionDigits;

  constructor(locale?: string) {
    super(locale, {
      maximumFractionDigits: fractionDigits,
    });
  }
}

export default function useHoursFormatter(): HoursFormatter {
  const i18n = useI18n();
  return useMemo(() => new HoursFormatter(i18n.locale), [i18n.locale]);
}
