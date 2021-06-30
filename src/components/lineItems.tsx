import Button from '@leafygreen-ui/button';
import Icon from '@leafygreen-ui/icon';
import { Cell, Row, Table, TableHeader } from '@leafygreen-ui/table';
import Clockify from 'gigbook/clockify/client';
import { FormValueController } from 'gigbook/hooks/useForm';
import { LineItem } from 'gigbook/pages';
import { DateTime } from 'luxon';
import useSWR from 'swr';
import * as uuid from 'uuid';

const currencyFormatter = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'USD',
});

export interface LineItemsProps {
  controller: FormValueController<LineItem[]>;
  period: DateTime;
  billingIncrement: number;
}

export default function LineItems(props: LineItemsProps): JSX.Element {
  const { data: apiKey } = useSWR<{ apiKey: string }>('/api/clockify/api-key');

  function set(li: LineItem, k: keyof LineItem, v: LineItem[typeof k]): void {
    const all = props.controller.value;
    const i = all.indexOf(li);
    const newItems = all.slice(0, i);
    newItems.push({ ...li, [k]: v });
    newItems.push(...all.slice(i + 1));
    props.controller.set(newItems);
  }

  return (
    <div>
      <Button
        variant="primary"
        leftGlyph={<Icon glyph="Refresh" />}
        onClick={async (e) => {
          e.preventDefault();
          if (apiKey === undefined) {
            return;
          }
          const clockify = new Clockify(apiKey.apiKey);
          try {
            const invoice = await clockify.getInvoice(
              '6011984482050431e7490c55',
              props.period,
            );
            const all = Object.values(invoice.clients)[0].lineItems.map(
              (li): LineItem => {
                const minutes = li.quantity.as('minutes');
                const hours =
                  (Math.ceil(minutes / props.billingIncrement) *
                    props.billingIncrement) /
                  60;
                return {
                  id: uuid.v4(),
                  project: li.project.name,
                  task: li.task,
                  rate: li.rate / 100,
                  hours,
                };
              },
            );
            props.controller.set(all);
          } catch (e) {
            console.error(e);
          }
        }}
        disabled={apiKey === undefined}
      >
        Import from Clockify
      </Button>
      <Table
        data={props.controller.value as LineItem[]}
        columns={[
          <TableHeader key="0" label="Project" />,
          <TableHeader key="1" label="Task" />,
          <TableHeader key="2" label="Rate" />,
          <TableHeader key="3" label="Hours" />,
          <TableHeader key="4" label="Total" />,
        ]}
      >
        {({ datum }) => (
          <Row key={datum.id}>
            <Cell isHeader={false}>{datum.project}</Cell>
            <Cell isHeader={false}>{datum.task}</Cell>
            <Cell isHeader={false}>{datum.rate}</Cell>
            <Cell isHeader={false}>{datum.hours}</Cell>
            <Cell isHeader={false}>
              {currencyFormatter.format(datum.rate * Number(datum.hours))}
            </Cell>
          </Row>
        )}
      </Table>
    </div>
  );
}
