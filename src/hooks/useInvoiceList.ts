import useI18n from 'gigbook/hooks/useI18n';
import {
  BodyInvoice,
  computeInvoice,
  fromBody,
  Invoice,
  InvoiceComputations,
} from 'gigbook/models/invoice';
import useSWR from 'swr';

export default function useInvoiceList(): InvoiceComputations[] | undefined {
  const { locale } = useI18n();
  const { data } = useSWR<BodyInvoice[]>('/api/invoices');
  return data?.map((i) => computeInvoice(fromBody(i) as Invoice, locale));
}
