import useI18n from 'gigbook/hooks/useI18n';
import {
  aggregateInvoiceLineItems,
  InvoiceLineItem,
} from 'gigbook/models/invoice';
import Table from 'react-bootstrap/Table';

export interface LineItemsTableProps {
  lineItems: InvoiceLineItem[];
  currency: string;
  increment: number;
}

export default function LineItemsTable(
  props: LineItemsTableProps,
): JSX.Element {
  const { locale } = useI18n();
  const lineItems = aggregateInvoiceLineItems(props.lineItems, {
    currency: props.currency,
    increment: props.increment,
    locale,
  });
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
        {lineItems.all.map((li) => (
          <tr key={li.id}>
            <td>{li.project}</td>
            <td>{li.task}</td>
            <td align="right">{li.rate}</td>
            <td align="right">{li.hours}</td>
            <td align="right">{li.total}</td>
          </tr>
        ))}
        <tr>
          <td colSpan={4} />
          <td align="right">
            <strong>{lineItems.total}</strong>
          </td>
        </tr>
      </tbody>
    </Table>
  );
}
