import useForm, { Form } from 'gigbook/hooks/useForm';
import { toBody } from 'gigbook/models/invoice';
import { LineItem } from 'gigbook/pages';
import { NumberInputValue } from 'gigbook/util/type';
import { DateTime, Duration } from 'luxon';

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
  lineItems: [] as LineItem[],
};

export default function useInvoiceForm(): Form<typeof initialValues> {
  return useForm({
    initialValues,
    async onSubmit(values): Promise<void> {
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
        },
        lineItems: values.lineItems.map((li) => ({
          project: li.project,
          task: li.task,
          rate: li.rate,
          duration: li.quantity,
        })),
      });
      const res = await fetch('/api/invoices', {
        method: 'POST',
        credentials: 'include',
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
}
