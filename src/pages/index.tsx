import Clockify, {
  ClockifyError,
  isClockifyError,
} from 'gigbook/clockify/client';
import Layout from 'gigbook/components/layout';
import useLocalStorage from 'gigbook/hooks/useLocalStorage';
import { DateTime } from 'luxon';
import { useState } from 'react';
import useSWR from 'swr';

export default function Index(): JSX.Element {
  const { data: apiKey } = useSWR<{ apiKey: string }>('/api/clockify/api-key');

  const [month, setMonth] = useLocalStorage('clockify-month', useState(''));
  const [log, setLog] = useState('');

  return (
    <Layout>
      <div>
        <label htmlFor="month">Invoice Period</label>
        <input
          id="month"
          name="month"
          type="date"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
      </div>
      <button
        onClick={
          !apiKey
            ? undefined
            : async () => {
                const clockify = new Clockify(apiKey.apiKey);
                try {
                  const invoice = await clockify.getInvoice(
                    '6011984482050431e7490c55',
                    DateTime.fromISO(month).setZone('local'),
                  );
                  setLog(`${JSON.stringify(invoice, null, 2)}`);
                } catch (e) {
                  if (isClockifyError(e)) {
                    const { status, statusText }: ClockifyError = e;
                    setLog(`${status} ${statusText}`);
                  }
                }
              }
        }
        disabled={!apiKey}
      >
        Invoice
      </button>
      <pre>{log}</pre>
    </Layout>
  );
}
