import useI18n from 'gigbook/hooks/useI18n';
import {
  BodyInvoice,
  computeInvoice,
  fromBody,
  InvoiceAndComputations,
} from 'gigbook/models/invoice';
import useSWR from 'swr';

export default function useInvoice(
  invoiceId?: string,
): InvoiceAndComputations | undefined {
  const { locale } = useI18n();
  const { data } = useSWR<BodyInvoice>(
    invoiceId ? `/api/invoices/${encodeURIComponent(invoiceId)}` : null,
  );
  const invoice = fromBody(data);
  if (invoice) {
    return {
      invoice,
      computations: computeInvoice(invoice, locale),
    };
  }
  return undefined;
}
