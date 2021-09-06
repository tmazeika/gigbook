import Fraction from 'fraction.js';
import { getExchangeRate, getInvoicePrefill } from 'gigbook/api-client';
import useForm, { Form } from 'gigbook/hooks/useForm';
import useInvoices from 'gigbook/hooks/useInvoices';
import useLocalStorage from 'gigbook/hooks/useLocalStorage';
import useSignal from 'gigbook/hooks/useSignal';
import { isApiError } from 'gigbook/models/apiResponse';
import { Currency } from 'gigbook/models/currency';
import { Invoice, InvoiceLineItem } from 'gigbook/models/invoice';
import NumberInputValue from 'gigbook/util/numberInputValue';
import { DateTime, Duration } from 'luxon';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const today = DateTime.now().startOf('day');

const lastMonth = today
  .minus(Duration.fromObject({ months: 1 }))
  .startOf('month');

const initialValues = {
  reference: '',
  date: today,
  periodStart: lastMonth,
  periodEnd: lastMonth.endOf('month').startOf('day'),
  payeeName: '',
  payeeDescription: '',
  payeeAddress: '',
  clientName: '',
  clientAddress: '',
  clientCurrency: 'usd' as Currency,
  billingIncrement: NumberInputValue.fromNumber(6),
  billingNetTerms: NumberInputValue.fromNumber(30),
  billingCurrency: 'usd' as Currency,
  lineItems: [] as InvoiceLineItem[],
};

type Values = typeof initialValues;

export default function useInvoiceForm(saveKey: string): Form<Values> {
  const { create: createInvoice } = useInvoices({ fetch: false });
  const router = useRouter();
  const signal = useSignal();
  const [storedValues, setStoredValues] = useLocalStorage(
    saveKey,
    initialValues,
  );
  const form = useForm({
    initialValues: storedValues,
    async onSubmit(values): Promise<void> {
      // TODO: calculate exchangeRate server-side
      const exchangeRate = await getExchangeRate(
        {
          from: values.billingCurrency,
          to: values.clientCurrency,
          at: today.toISO(),
        },
        signal,
      );
      const body = valuesToInvoice(values, exchangeRate);
      try {
        const location = await createInvoice(body, signal);
        await router.push(location);
      } catch (err) {
        if (!isApiError(err)) {
          throw err;
        }
        alert(err.message);
      }
    },
  });
  const { values, setMany } = form;
  useEffect(() => {
    if (storedValues === initialValues) {
      getInvoicePrefill(signal).then((data) => {
        setMany({
          ...data,
          billingIncrement: data.billingIncrement
            ? NumberInputValue.fromNumber(data.billingIncrement)
            : undefined,
          billingNetTerms: data.billingNetTerms
            ? NumberInputValue.fromNumber(data.billingNetTerms)
            : undefined,
        });
      });
    }
  }, [signal, storedValues, setMany]);
  useEffect(() => setStoredValues(values), [setStoredValues, values]);
  return form;
}

const valuesToInvoice = (values: Values, exchangeRate: number): Invoice => ({
  id: undefined,
  reference: values.reference,
  date: values.date,
  period: {
    start: values.periodStart,
    end: values.periodEnd,
  },
  payee: {
    name: values.payeeName,
    description: values.payeeDescription,
    address: values.payeeAddress,
  },
  client: {
    name: values.clientName,
    address: values.clientAddress,
    currency: values.clientCurrency,
  },
  billing: {
    increment: values.billingIncrement.n ?? 0,
    netTerms: values.billingNetTerms.n ?? 0,
    currency: values.billingCurrency,
    exchangeRate: new Fraction(exchangeRate),
  },
  lineItems: values.lineItems.map((li) => ({
    id: undefined,
    project: li.project,
    task: li.task,
    rate: li.rate,
    duration: li.duration,
  })),
});
