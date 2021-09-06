import { postInvoices } from 'gigbook/api-client';
import useI18n from 'gigbook/hooks/useI18n';
import {
  computeInvoice,
  Invoice,
  InvoiceAndComputations,
} from 'gigbook/models/invoice';
import { urlEnc } from 'gigbook/util/url';
import useSWR from 'swr';

interface Options {
  fetch: boolean;
}

interface Hook {
  invoices: InvoiceAndComputations[] | undefined;

  create(invoice: Invoice, signal: AbortSignal): Promise<string>;
}

export default function useInvoices(options: Options = { fetch: true }): Hook {
  const { locale } = useI18n();
  const { data: invoices, mutate } = useSWR<Invoice[]>(
    options.fetch ? '/api/invoices' : null,
  );
  return {
    invoices: invoices?.map((invoice) => ({
      invoice,
      computations: computeInvoice(invoice, locale),
    })),
    async create(invoice: Invoice, signal: AbortSignal): Promise<string> {
      const dbInvoice = await postInvoices(invoice, signal);
      await mutate();
      return urlEnc('/invoices', dbInvoice.id ?? '');
    },
  };
}
