import {
  TextInput,
  NumberInput,
  DateInput,
  TextAreaInput,
} from 'gigbook/components/form';
import Layout from 'gigbook/components/layout';
import LineItems from 'gigbook/components/lineItems';
import useCodeMirror from 'gigbook/hooks/useCodeMirror';
import useForm from 'gigbook/hooks/useForm';
import useId from 'gigbook/hooks/useId';
import { NumberInputValue } from 'gigbook/util/type';
import { DateTime } from 'luxon';
import Mustache from 'mustache';
import { useMemo } from 'react';

export interface LineItem {
  id: string;
  project: string;
  task: string;
  rate: number;
  hours: number;
}

export interface BankDetail {
  key: string;
  value: string;
}

export default function Index(): JSX.Element {
  const frameId = useId();
  const form = useForm({
    initialValues: {
      id: '000 000',
      period: DateTime.now().startOf('day'),
      myName: '',
      myDescription: '',
      myAddress: '',
      clientName: '',
      clientAddress: '',
      clientCurrency: '',
      lineItems: [] as LineItem[],
      billingIncrement: NumberInputValue.fromNumber(6),
      billingNet: NumberInputValue.fromNumber(30),
      billingCurrency: '',
      bank: [] as BankDetail[],
      template: '',
      templateStyles: '',
    },
  });
  const htmlEditor = useCodeMirror(
    'html',
    '<!doctype html>\n' +
      '<html lang="en">\n' +
      '<head>\n' +
      '  <meta charset="utf-8">\n' +
      '  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:ital,wght@0,400;0,700;1,400">\n' +
      '  <title>invoice_{{ client.invoice_num }}</title>\n' +
      '</head>\n' +
      '<body>\n' +
      '  <header class="flex">\n' +
      '    <table class="bill-to">\n' +
      '      <tbody>\n' +
      '        <tr>\n' +
      '          <td class="muted">From</td>\n' +
      '          <td>\n' +
      '            <pre>{{ company.address }}</pre>\n' +
      '          </td>\n' +
      '        </tr>\n' +
      '        <tr>\n' +
      '          <td class="muted">Bill To</td>\n' +
      '          <td>\n' +
      '            <pre>{{ client.address }}</pre>\n' +
      '          </td>\n' +
      '        </tr>\n' +
      '      </tbody>\n' +
      '    </table>\n' +
      '    <div class="flex-spacer"></div>\n' +
      '    <table class="invoice-info">\n' +
      '      <tbody>\n' +
      '        <tr>\n' +
      '          <td class="muted">Invoice #</td>\n' +
      '          <td>{{ id }}</td>\n' +
      '        </tr>\n' +
      '        <tr>\n' +
      '          <td class="muted">Invoice Date</td>\n' +
      '          <td>{{ period }}</td>\n' +
      '        </tr>\n' +
      '        <tr>\n' +
      '          <td class="muted">Due Date</td>\n' +
      '          <td>{{ period | date }}</td>\n' +
      '        </tr>\n' +
      '      </tbody>\n' +
      '    </table>\n' +
      '  </header>\n' +
      '  <main>\n' +
      '    <table class="work">\n' +
      '      <thead>\n' +
      '        <tr>\n' +
      '          <td class="muted" colspan="4">{{ company_info.description }}</td>\n' +
      '        </tr>\n' +
      '        <tr>\n' +
      '          <td>Description</td>\n' +
      '          <td>Rate</td>\n' +
      '          <td>Hours</td>\n' +
      '          <td>Total</td>\n' +
      '        </tr>\n' +
      '      </thead>\n' +
      '      <tbody>\n' +
      '        {% for item in work_items %}\n' +
      '          <tr>\n' +
      '            <td>{{ item.project }} &mdash; {{ item.description }}</td>\n' +
      '            <td>{{ item.rate | money }}</td>\n' +
      '            <td>{{ item.rounded_hours }}</td>\n' +
      '            <td>{{ item.total | money }}</td>\n' +
      '          </tr>\n' +
      '        {% endfor %}\n' +
      '        <tr>\n' +
      '          <td class="work-total" colspan="4">\n' +
      '            <span class="muted">Amount Due</span>\n' +
      '            <span>{{ work_total | money }}</span>\n' +
      '          </td>\n' +
      '        </tr>\n' +
      '      </tbody>\n' +
      '    </table>\n' +
      '  </main>\n' +
      '  <footer>\n' +
      '    <p>\n' +
      '      Please pay <strong>{{ work_total_converted | money(client.currency_code) }}</strong>\n' +
      '      by <strong>{{ invoice_due | date }}</strong> to:\n' +
      '    </p>\n' +
      '    <table class="pay-to">\n' +
      '      <tbody>\n' +
      '        {% for key, value in bank_account.items() %}\n' +
      '          <tr>\n' +
      '            <td class="muted">{{ key }}</td>\n' +
      '            <td>\n' +
      '              {% if value is string %}\n' +
      '                {{ value }}\n' +
      '              {% else %}\n' +
      '                {% for line in value %}\n' +
      '                  {{ line | md | safe }}<br/>\n' +
      '                {% endfor %}\n' +
      '              {% endif %}\n' +
      '            </td>\n' +
      '          </tr>\n' +
      '        {% endfor %}\n' +
      '      </tbody>\n' +
      '    </table>\n' +
      '    {% if work_total_converted != work_total %}\n' +
      '      <p>\n' +
      '        <em class="small muted">\n' +
      '          1 USD = {{ exchange_rate }} {{ client.currency_code | upper }}\n' +
      '        </em>\n' +
      '      </p>\n' +
      '    {% endif %}\n' +
      '  </footer>\n' +
      '</body>\n' +
      '</html>',
  );
  const cssEditor = useCodeMirror('css');
  form.set('template', htmlEditor.value);
  form.set('templateStyles', cssEditor.value);

  useMemo(() => {
    try {
      Mustache.parse(form.values.template);
    } catch (e) {
      //
    }
  }, [form.values.template]);

  let rendered: string;
  try {
    rendered = Mustache.render(form.values.template, {
      id: form.values.id,
      period: form.values.period.toLocaleString(),
      company: {
        name: form.values.myName,
        description: form.values.myDescription,
        address: form.values.myAddress,
      },
      client: {
        name: form.values.clientName,
        address: form.values.clientAddress,
        currency: form.values.clientCurrency,
      },
      billing: {
        increment: form.values.billingIncrement.n,
        net: form.values.billingNet.n,
        currency: form.values.billingCurrency,
      },
      lineItems: form.values.lineItems,
      styles: form.values.templateStyles,
    });
  } catch (e) {
    rendered = String(e);
  }

  return (
    <Layout>
      <form>
        <TextInput controller={form.control('id')} label="Invoice ID" />
        <DateInput controller={form.control('period')} label="Period" />
        <TextInput controller={form.control('myName')} label="Company Name" />
        <TextInput
          controller={form.control('myDescription')}
          label="Company Description"
        />
        <TextAreaInput
          controller={form.control('myAddress')}
          label="Company Address"
        />
        <TextInput
          controller={form.control('clientName')}
          label="Client Name"
        />
        <TextAreaInput
          controller={form.control('clientAddress')}
          label="Client Address"
        />
        <TextInput
          controller={form.control('clientCurrency')}
          label="Client Currency"
        />
        <NumberInput
          controller={form.control('billingIncrement')}
          label="Billing Increment"
          positive
          integer
        />
        <NumberInput
          controller={form.control('billingNet')}
          label="Billing Net"
          positive
          integer
        />
        <TextInput
          controller={form.control('billingCurrency')}
          label="Billing Currency"
        />
        <LineItems
          controller={form.control('lineItems')}
          period={form.values.period}
          billingIncrement={form.values.billingIncrement.n ?? 6}
        />
        {cssEditor.element}
        {htmlEditor.element}
      </form>
      <button>Generate</button>
      <iframe
        id={frameId}
        name={frameId}
        title={frameId}
        sandbox=""
        srcDoc={rendered}
        style={{
          width: '8.5in',
          height: '11in',
          border: 'none',
        }}
      />
    </Layout>
  );
}
