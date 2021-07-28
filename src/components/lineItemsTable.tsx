import useFormattedLineItems from 'gigbook/hooks/useFormattedLineItems';
import { InvoiceLineItem } from 'gigbook/models/invoice';
import Table from 'react-bootstrap/Table';

export interface LineItemsTableProps {
  lineItems: InvoiceLineItem[];
  currency: string;
  increment: number;
  exchangeRate?: number;
}

export default function LineItemsTable(
  props: LineItemsTableProps,
): JSX.Element {
  const formattedLineItems = useFormattedLineItems(
    props.lineItems,
    props.currency,
    props.increment,
    props.exchangeRate ?? 1,
  );

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
        {formattedLineItems?.all &&
          formattedLineItems.all.map((li, i) => (
            <tr key={i}>
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
            <strong>{formattedLineItems?.total}</strong>
          </td>
        </tr>
      </tbody>
    </Table>
  );
}
