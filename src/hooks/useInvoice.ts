import useExchangeRate from 'gigbook/hooks/useExchangeRate';
import { BodyInvoice, fromBody, Invoice } from 'gigbook/models/invoice';
import { DateTime } from 'luxon';
import useSWR from 'swr';

export interface ProcessedInvoice extends Invoice {
  due: DateTime;
  exchangeRate: number;
}

export default function useInvoice(
  invoiceId?: string,
): ProcessedInvoice | undefined {
  const { data } = useSWR<BodyInvoice>(
    invoiceId ? `/api/invoices/${encodeURIComponent(invoiceId)}` : null,
  );
  const invoice = fromBody(data);
  const exchangeRate = useExchangeRate(
    invoice?.billing.currency,
    invoice?.client.currency,
    invoice?.date,
  );
  if (!invoice || !exchangeRate) {
    return undefined;
  }
  return {
    ...invoice,
    due: invoice.date.plus({ days: invoice.billing.netTerms }),
    exchangeRate,
  };
}
