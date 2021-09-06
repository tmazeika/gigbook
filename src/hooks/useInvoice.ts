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
  invoice: InvoiceAndComputations | undefined;
}

export default function useInvoice(
  id?: string,
  options: Options = { fetch: true },
): Hook {
  const { locale } = useI18n();
  const { data: invoice } = useSWR<Invoice>(
    options.fetch && id ? urlEnc('/api/invoices', id) : null,
  );
  return {
    invoice: invoice
      ? {
          invoice,
          computations: computeInvoice(invoice, locale),
        }
      : undefined,
  };
}
