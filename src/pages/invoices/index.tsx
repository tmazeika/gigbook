import Layout from 'gigbook/components/Layout';
import useI18n from 'gigbook/hooks/useI18n';
import useInvoices from 'gigbook/hooks/useInvoices';
import { InvoiceAndComputations } from 'gigbook/models/invoice';
import { useRouter } from 'next/router';
import Table from 'react-bootstrap/Table';
import styled from 'styled-components';

const StyledTr = styled.tr`
  cursor: pointer;
`;

export default function Index(): JSX.Element {
  const { locale } = useI18n();
  const { invoices: unsortedInvoices } = useInvoices();
  const invoices = getSortedInvoices(unsortedInvoices);
  const router = useRouter();

  return (
    <Layout>
      <Table hover>
        <thead>
          <tr>
            <th>Date</th>
            <th>Period</th>
            <th>Reference</th>
            <th>Client</th>
            <th>Balance Due</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map(({ invoice, computations }) => (
            <StyledTr
              key={invoice.id}
              onClick={() => {
                void router.push(`/invoices/${invoice.id ?? ''}`);
              }}
            >
              <td>
                {invoice.date.toLocaleString(
                  { dateStyle: 'medium' },
                  { locale },
                )}
              </td>
              <td>
                {invoice.period.start.toLocaleString(
                  {
                    dateStyle: 'short',
                  },
                  { locale },
                )}{' '}
                &ndash;{' '}
                {invoice.period.end.toLocaleString(
                  {
                    dateStyle: 'short',
                  },
                  { locale },
                )}
              </td>
              <td>{invoice.reference}</td>
              <td>{invoice.client.name}</td>
              <td>{computations.lineItems.total}</td>
            </StyledTr>
          ))}
        </tbody>
      </Table>
    </Layout>
  );
}

function getSortedInvoices(
  invoices: InvoiceAndComputations[] | undefined,
): InvoiceAndComputations[] {
  if (invoices === undefined) {
    return [];
  }
  return [...invoices].sort(
    (a, b) => b.invoice.date.valueOf() - a.invoice.date.valueOf(),
  );
}
