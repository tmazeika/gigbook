import Fraction from 'fraction.js';
import { Duration } from 'luxon';
import { useMemo } from 'react';
import Table from 'react-bootstrap/Table';

const hoursFractionDigits = 2;

const hoursFormatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: hoursFractionDigits,
});

export interface LineItem {
  id: string;
  project: string;
  task: string;
  rate: Fraction;
  quantity: Duration;
}

export interface LineItemsTableProps {
  lineItems: LineItem[];
  currency: string;
  increment: number;
}

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

export default function LineItemsTable(
  props: LineItemsTableProps,
): JSX.Element {
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

  return (
    <Table striped bordered>
      <thead>
        <tr>
          <th>Project</th>
          <th>Task</th>
          <th>Rate</th>
          <th>Hours</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {props.lineItems.map((li) => (
          <Row
            key={li.id}
            lineItem={li}
            currencyFormatter={currencyFormatter}
            increment={props.increment}
          />
        ))}
        <tr>
          <td colSpan={4} />
          <td align="right">
            <strong>{totalStr}</strong>
          </td>
        </tr>
      </tbody>
    </Table>
  );
}

interface RowProps {
  lineItem: LineItem;
  currencyFormatter: CurrencyFormatter;
  increment: number;
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
    <tr>
      <td>{props.lineItem.project}</td>
      <td>{props.lineItem.task}</td>
      <td align="right">{rateStr}</td>
      <td align="right">{hoursStr}</td>
      <td align="right">{totalStr}</td>
    </tr>
  );
}

interface ProcessResult {
  rate: Fraction;
  hours: Fraction;
  total: Fraction;
}

function process(
  li: LineItem,
  increment: number,
  currencyFractionDigits: number,
): ProcessResult {
  const rate = li.rate.round(currencyFractionDigits);
  const hours = roundDurationToIncrement(li.quantity, increment)
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
