import { TextInput, NumberInput, DateInput } from 'gigbook/components/form';
import Layout from 'gigbook/components/layout';
import useCodeMirror from 'gigbook/hooks/useCodeMirror';
import useForm from 'gigbook/hooks/useForm';
import { NumberInputValue } from 'gigbook/util/type';
import { DateTime } from 'luxon';

export interface LineItem {
  project: string;
  task: string;
  rate: number;
  duration: string;
}

export interface BankDetail {
  key: string;
  value: string;
}

export default function Index(): JSX.Element {
  // const { data: apiKey } = useSWR<{ apiKey: string }>('/api/clockify/api-key');

  const form = useForm({
    initialValues: {
      id: '',
      date: DateTime.now(),
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
  const htmlEditor = useCodeMirror('html');
  const cssEditor = useCodeMirror('css');
  form.set('template', htmlEditor.value);
  form.set('templateStyles', cssEditor.value);
  return (
    <Layout>
      <form>
        <DateInput controller={form.control('date')} label="Period" />
        <TextInput controller={form.control('myName')} label="Company Name" />
        <TextInput
          controller={form.control('myDescription')}
          label="Company Description"
        />
        <TextInput
          controller={form.control('myAddress')}
          label="Company Address"
        />
        <TextInput
          controller={form.control('clientName')}
          label="Client Name"
        />
        <TextInput
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
        />
        <NumberInput
          controller={form.control('billingNet')}
          label="Billing Net"
        />
        <TextInput
          controller={form.control('billingCurrency')}
          label="Billing Currency"
        />
        {cssEditor.element}
        {htmlEditor.element}
      </form>
      <button>Generate</button>
      {/*<button*/}
      {/*  onClick={*/}
      {/*    !apiKey*/}
      {/*      ? undefined*/}
      {/*      : async () => {*/}
      {/*          const clockify = new Clockify(apiKey.apiKey);*/}
      {/*          try {*/}
      {/*            const invoice = await clockify.getInvoice(*/}
      {/*              '6011984482050431e7490c55',*/}
      {/*              DateTime.fromISO(month).setZone('local'),*/}
      {/*            );*/}
      {/*            setLog(`${JSON.stringify(invoice, null, 2)}`);*/}
      {/*          } catch (e) {*/}
      {/*            if (isClockifyError(e)) {*/}
      {/*              const { status, statusText }: ClockifyError = e;*/}
      {/*              setLog(`${status} ${statusText}`);*/}
      {/*            }*/}
      {/*          }*/}
      {/*        }*/}
      {/*  }*/}
      {/*  disabled={!apiKey}*/}
      {/*>*/}
      {/*  Invoice*/}
      {/*</button>*/}
      {/*<pre>{log}</pre>*/}
    </Layout>
  );
}
