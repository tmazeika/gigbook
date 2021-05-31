import { useState } from 'react';
import Layout from '../components/layout';
import useClients from '../hooks/useClients';

export default function Clients(): JSX.Element {
  const clients = useClients();
  const [name, setName] = useState('');
  return (
    <Layout>
      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <button
        onClick={() => clients.create(name)}
        disabled={
          !name || (clients.data?.some((c) => c.name === name) ?? false)
        }
      >
        Create
      </button>
      {clients.data ? (
        <ul>
          {clients.data.map((c) => (
            <li key={c.id}>
              {c.name}
              <button onClick={() => clients.update(c.id, c.name + 'a')}>
                Add &apos;a&apos;
              </button>
              <button onClick={() => clients.delete(c.id, c.name)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <span>Loading...</span>
      )}
    </Layout>
  );
}
