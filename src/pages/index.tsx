import { TextInput, NumberInput, DateInput } from 'gigbook/components/form';
import Layout from 'gigbook/components/layout';
import useCodeMirror from 'gigbook/hooks/useCodeMirror';
import useForm from 'gigbook/hooks/useForm';
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
      date: DateTime.now().toISODate(),
      myName: '',
      myDescription: '',
      myAddress: '',
      clientName: '',
      clientAddress: '',
      clientCurrency: '',
      lineItems: [] as LineItem[],
      billingIncrement: 6,
      billingNet: 30,
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
        <TextInput form={form} formKey={'id'} label="ID" />
        <DateInput form={form} formKey={'date'} label="Period" />
        <TextInput form={form} formKey={'myName'} label="Company Name" />
        <TextInput
          form={form}
          formKey={'myDescription'}
          label="Company Description"
        />
        <TextInput form={form} formKey={'myAddress'} label="Company Address" />
        <TextInput form={form} formKey={'clientName'} label="Client Name" />
        <TextInput
          form={form}
          formKey={'clientAddress'}
          label="Client Address"
        />
        <TextInput
          form={form}
          formKey={'clientCurrency'}
          label="Client Currency"
        />
        <NumberInput
          form={form}
          formKey={'billingIncrement'}
          label="Billing Increment"
        />
        <NumberInput form={form} formKey={'billingNet'} label="Billing Net" />
        <TextInput
          form={form}
          formKey={'billingCurrency'}
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
