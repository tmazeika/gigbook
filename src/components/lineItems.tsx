import Fraction from 'fraction.js';
import { InvoiceLineItem } from 'gigbook/models/invoice';
import { Duration } from 'luxon';
import React, { useMemo } from 'react';

const hoursFractionDigits = 2;

const hoursFormatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: hoursFractionDigits,
});

class CurrencyFormatter extends Intl.NumberFormat {
  constructor(currency: string) {
    super(undefined, {
      style: 'currency',
      currency,
    });
  }

  get fractionDigits(): number {
    return this.resolvedOptions().maximumFractionDigits;
  }
}

export interface LineItemsProps {
  lineItems: InvoiceLineItem[];
  currency: string;
  increment: number;
  rowFactory: (
    project: string,
    task: string,
    rate: string,
    hours: string,
    total: string,
    i: number,
  ) => React.ReactNode;
  children: (rows: React.ReactNode, total: string) => React.ReactNode;
}

export default function LineItems(props: LineItemsProps): JSX.Element {
  const currencyFormatter = useMemo(
    () => new CurrencyFormatter(props.currency),
    [props.currency],
  );
  const currencyFractionDigits = currencyFormatter.fractionDigits;
  const total = props.lineItems.reduce(
    (sum, li) =>
      sum.add(process(li, props.increment, currencyFractionDigits).total),
    new Fraction(0),
  );
  const totalStr = currencyFormatter.format(total.valueOf());

  const rows = props.lineItems.map((li, i) => (
    <Row
      key={i}
      i={i}
      lineItem={li}
      currencyFormatter={currencyFormatter}
      increment={props.increment}
    >
      {props.rowFactory}
    </Row>
  ));
  return <>{props.children(rows, totalStr)}</>;
}

interface RowProps {
  i: number;
  lineItem: InvoiceLineItem;
  currencyFormatter: CurrencyFormatter;
  increment: number;
  children: (
    project: string,
    task: string,
    rate: string,
    hours: string,
    total: string,
    i: number,
  ) => React.ReactNode;
}

function Row(props: RowProps): JSX.Element {
  const { currencyFormatter } = props;
  const { rate, hours, total } = process(
    props.lineItem,
    props.increment,
    currencyFormatter.fractionDigits,
  );

  const rateStr = currencyFormatter.format(rate.valueOf());
  const hoursStr = hoursFormatter.format(hours.valueOf());
  const totalStr = currencyFormatter.format(total.valueOf());

  return (
    <>
      {props.children(
        props.lineItem.project,
        props.lineItem.task,
        rateStr,
        hoursStr,
        totalStr,
        props.i,
      )}
    </>
  );
}

interface ProcessResult {
  rate: Fraction;
  hours: Fraction;
  total: Fraction;
}

function process(
  li: InvoiceLineItem,
  increment: number,
  currencyFractionDigits: number,
): ProcessResult {
  const rate = li.rate.round(currencyFractionDigits);
  const hours = roundDurationToIncrement(li.duration, increment)
    .div(60)
    .round(hoursFractionDigits);
  return {
    rate,
    hours,
    total: rate.mul(hours).round(currencyFractionDigits),
  };
}

function roundDurationToIncrement(
  duration: Duration,
  increment: number,
): Fraction {
  const minutes = durationToMinutes(duration);
  return increment === 0
    ? minutes
    : minutes.div(increment).ceil(0).mul(increment);
}

function durationToMinutes(duration: Duration): Fraction {
  const { years, milliseconds } = duration
    .shiftTo('years', 'milliseconds')
    .toObject();
  return new Fraction(years ?? 0).mul(525_600).add(milliseconds ?? 0, 60_000);
}
