import Fraction from 'fraction.js';
import useForm, { Form } from 'gigbook/hooks/useForm';
import useLocalStorage from 'gigbook/hooks/useLocalStorage';
import { InvoiceLineItem, toBody } from 'gigbook/models/invoice';
import { ExchangeRateResponse } from 'gigbook/pages/api/exchange-rate';
import { InvoicePrefillResponse } from 'gigbook/pages/api/invoices/prefill';
import { NumberInputValue } from 'gigbook/util/type';
import { buildRelUrl } from 'gigbook/util/url';
import { DateTime, Duration } from 'luxon';
import { useEffect } from 'react';

const today = DateTime.now().startOf('day');

const lastMonth = today
  .minus(Duration.fromObject({ months: 1 }))
  .startOf('month');

export type Currency = 'usd' | 'gbp' | 'jpy';

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

type StorableInvoice = {
  reference: string;
  date: string;
  periodStart: string;
  periodEnd: string;
  payeeName: string;
  payeeDescription: string;
  payeeAddress: string;
  clientName: string;
  clientAddress: string;
  clientCurrency: Currency;
  billingIncrement: string;
  billingNetTerms: string;
  billingCurrency: Currency;
  lineItems: {
    id?: string;
    project: string;
    task: string;
    rateN: number;
    rateD: number;
    duration: string;
  }[];
};

export default function useInvoiceForm(saveKey: string): Form<Values> {
  const form = useForm({
    initialValues,
    async onSubmit(values): Promise<void> {
      const exchangeRateRes = await fetch(
        buildRelUrl('/api/exchange-rate', {
          from: values.billingCurrency,
          to: values.clientCurrency,
          date: today,
        }),
      );
      const exchangeRate = new Fraction(
        ((await exchangeRateRes.json()) as ExchangeRateResponse).rate,
      );
      const body = toBody({
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
          exchangeRate,
        },
        lineItems: values.lineItems.map((li) => ({
          project: li.project,
          task: li.task,
          rate: li.rate,
          duration: li.duration,
        })),
      });
      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        alert(`${res.status} ${res.statusText}`);
      }
    },
  });
  const prefill = form.prefill;
  const [storedValues, setStoredValues] = useLocalStorage(
    saveKey,
    initialValues,
    fromStorable,
    toStorable,
  );

  useEffect(() => {
    if (storedValues !== null) {
      prefill(storedValues);
    } else {
      const controller = new AbortController();
      void fetch('/api/invoices/prefill', {
        signal: controller.signal,
      })
        .then((res) => res.json() as InvoicePrefillResponse)
        .then((data) =>
          prefill({
            ...data,
            clientCurrency: data.clientCurrency as Currency,
            billingIncrement: data.billingIncrement
              ? NumberInputValue.fromNumber(data.billingIncrement)
              : undefined,
            billingNetTerms: data.billingNetTerms
              ? NumberInputValue.fromNumber(data.billingNetTerms)
              : undefined,
            billingCurrency: data.billingCurrency as Currency,
          }),
        )
        .catch(console.error);
      return () => controller.abort();
    }
  }, [storedValues, prefill]);

  useEffect(() => setStoredValues(form.values), [setStoredValues, form.values]);

  return form;
}

function toStorable(form: Values): StorableInvoice {
  return {
    ...form,
    date: form.date.toISO(),
    periodStart: form.periodStart.toISO(),
    periodEnd: form.periodEnd.toISO(),
    billingIncrement: form.billingIncrement.text,
    billingNetTerms: form.billingNetTerms.text,
    lineItems: form.lineItems.map((li) => ({
      id: li.id,
      project: li.project,
      task: li.task,
      rateN: li.rate.s * li.rate.n,
      rateD: li.rate.d,
      duration: li.duration.shiftTo('hours', 'seconds').toISO(),
    })),
  };
}

function fromStorable(stored: StorableInvoice): Values {
  return {
    ...stored,
    date: DateTime.fromISO(stored.date),
    periodStart: DateTime.fromISO(stored.periodStart),
    periodEnd: DateTime.fromISO(stored.periodEnd),
    billingIncrement: NumberInputValue.fromText(stored.billingIncrement),
    billingNetTerms: NumberInputValue.fromText(stored.billingNetTerms),
    lineItems: stored.lineItems.map((li) => ({
      id: li.id,
      project: li.project,
      task: li.task,
      rate: new Fraction(li.rateN, li.rateD),
      duration: Duration.fromISO(li.duration),
    })),
  };
}
