import Fraction from 'fraction.js';
import useCurrencyFormatter, {
  CurrencyFormatter,
} from 'gigbook/hooks/useCurrencyFormatter';
import useHoursFormatter, {
  HoursFormatter,
} from 'gigbook/hooks/useHoursFormatter';
import { InvoiceLineItem } from 'gigbook/models/invoice';
import { Duration } from 'luxon';

export interface FormattedInvoiceLineItem {
  project: string;
  task: string;
  rate: string;
  hours: string;
  total: string;
}

export interface LineItemsHook {
  all: Readonly<FormattedInvoiceLineItem>[];
  total: string;
  exchangedTotal: string;
}

export default function useFormattedLineItems(
  lineItems?: InvoiceLineItem[],
  currency?: string,
  increment?: number,
  exchangeRate?: number,
): Readonly<LineItemsHook> | undefined {
  const currencyFormatter = useCurrencyFormatter(currency);
  const exchangedCurrencyFormatter = useCurrencyFormatter(currency);
  const hoursFormatter = useHoursFormatter();

  if (
    !lineItems ||
    !increment ||
    !exchangeRate ||
    !currencyFormatter ||
    !exchangedCurrencyFormatter
  ) {
    return undefined;
  }

  const formattedLineItems = lineItems.map((li) =>
    format(li, {
      currencyFormatter,
      hoursFormatter,
      increment,
    }),
  );
  const numberTotal = formattedLineItems.reduce(
    (sum, li) => sum.add(li.numberTotal),
    new Fraction(0),
  );
  const total = currencyFormatter.format(numberTotal.valueOf());
  const exchangedTotal = exchangedCurrencyFormatter.format(
    numberTotal.mul(exchangeRate).valueOf(),
  );

  return {
    all: formattedLineItems,
    total,
    exchangedTotal,
  };
}

interface FormatOptions {
  currencyFormatter: CurrencyFormatter;
  hoursFormatter: HoursFormatter;
  increment: number;
}

function format(
  lineItem: InvoiceLineItem,
  options: FormatOptions,
): FormattedInvoiceLineItem & { numberTotal: Fraction } {
  const rate = lineItem.rate.round(options.currencyFormatter.fractionDigits);
  const hours = durationToMinutes(lineItem.duration)
    .div(options.increment)
    .ceil()
    .mul(options.increment, 60)
    .round(options.hoursFormatter.fractionDigits);
  const total = rate.mul(hours).round(options.currencyFormatter.fractionDigits);

  return {
    project: lineItem.project,
    task: lineItem.task,
    rate: options.currencyFormatter.format(rate.valueOf()),
    hours: options.hoursFormatter.format(hours.valueOf()),
    total: options.currencyFormatter.format(total.valueOf()),
    numberTotal: total,
  };
}

function durationToMinutes(duration: Duration): Fraction {
  const { minutes = 0, milliseconds = 0 } = duration
    .shiftTo('minutes', 'milliseconds')
    .toObject();
  return new Fraction(minutes).add(milliseconds ? 1 : 0);
}
