import useI18n from 'gigbook/hooks/useI18n';
import {
  aggregateInvoiceLineItems,
  InvoiceLineItem,
} from 'gigbook/models/invoice';
import Table from 'react-bootstrap/Table';
import styled from 'styled-components';

export interface LineItemsTableProps {
  lineItems: InvoiceLineItem[];
  currency: string;
  increment: number;
}

const NumericTh = styled.th`
  text-align: right;
`;

const NumericTd = styled.td`
  text-align: right;
`;

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
    <Table striped>
      <thead>
        <tr>
          <th>Project</th>
          <th>Task</th>
          <NumericTh>Rate</NumericTh>
          <NumericTh>Hours</NumericTh>
          <NumericTh>Total</NumericTh>
        </tr>
      </thead>
      <tbody>
        {lineItems.all.map((li) => (
          <tr key={li.id}>
            <td>{li.project}</td>
            <td>{li.task}</td>
            <NumericTd>{li.rate}</NumericTd>
            <NumericTd>{li.hours}</NumericTd>
            <NumericTd>{li.total}</NumericTd>
          </tr>
        ))}
        <tr>
          <td colSpan={4} />
          <NumericTd>
            <strong>{lineItems.total}</strong>
          </NumericTd>
        </tr>
      </tbody>
    </Table>
  );
}
