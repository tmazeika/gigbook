import Layout from 'gigbook/components/layout';
import useLocalStorage from 'gigbook/hooks/useLocalStorage';
import { useState } from 'react';

export default function Index(): JSX.Element {
  const [apiKey, setApiKey] = useLocalStorage('clockify-api-key', useState(''));
  const [log, setLog] = useState('');

  return (
    <Layout>
      <div>
        <label htmlFor="api-key">Clockify API Key</label>
        <input
          id="api-key"
          name="api-key"
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
      </div>
      <button
        onClick={async () => {
          const res = await fetch('/api/clockify/user', {
            headers: {
              'X-Api-Key': apiKey,
            },
          });
          if (res.ok) {
            const json: unknown = await res.json();
            setLog((log) => `${JSON.stringify(json, null, 2)}\n${log}`);
          } else {
            setLog((log) => `Error: ${res.status} ${res.statusText}\n${log}`);
          }
        }}
      >
        User
      </button>
      <button
        onClick={async () => {
          const res = await fetch('/api/clockify/workspaces', {
            headers: {
              'X-Api-Key': apiKey,
            },
          });
          if (res.ok) {
            const json: unknown = await res.json();
            setLog((log) => `${JSON.stringify(json, null, 2)}\n${log}`);
          } else {
            setLog((log) => `${res.status} ${res.statusText}\n${log}`);
          }
        }}
      >
        Workspaces
      </button>
      <pre>{log}</pre>
    </Layout>
  );
}
