import useI18n from 'gigbook/hooks/useI18n';
import {
  BodyInvoice,
  computeInvoice,
  fromSafeBody,
  InvoiceAndComputations,
} from 'gigbook/models/invoice';
import useSWR from 'swr';

export default function useInvoiceList(): InvoiceAndComputations[] | undefined {
  const { locale } = useI18n();
  const { data } = useSWR<BodyInvoice[]>('/api/invoices');
  return data
    ?.map((i) => fromSafeBody(i))
    .map((i) => ({
      invoice: i,
      computations: computeInvoice(i, locale),
    }));
}
