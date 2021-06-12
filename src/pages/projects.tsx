import Layout from 'gigbook/components/layout';
import useClients from 'gigbook/hooks/useClients';
import useForm from 'gigbook/hooks/useForm';
import useProjects from 'gigbook/hooks/useProjects';
import { useEffect, useState } from 'react';

export default function Projects(): JSX.Element {
  const clients = useClients();
  const [clientId, setClientId] = useState<number>();
  const projects = useProjects(clientId);

  useEffect(() => {
    setClientId(clients.data[0]?.id);
  }, [clients.data]);

  const form = useForm({
    initialValues: {
      name: '',
    },
    onValidate({ name }, errors) {
      if (!name) {
        errors.name = 'Required';
      }
      if (projects.data.map((c) => c.name).includes(name)) {
        errors.name = 'Already exists';
      }
    },
    async onSubmit({ name }) {
      await projects.save({ name, clientId: 66 });
    },
  });
  return (
    <Layout>
      <strong>Switch clients</strong>
      <ul>
        {clients.data.map((c) => (
          <li key={c.id}>
            <button onClick={() => setClientId(c.id)}>{c.name}</button>
          </li>
        ))}
      </ul>
      <h1>
        Projects for Client {clients.data.find((c) => c.id === clientId)?.name}
      </h1>
      <ul>
        {projects.data.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
      <hr />
      <form onSubmit={(e) => form.onSubmit(e)}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            maxLength={255}
            autoComplete="off"
            value={form.values.name}
            onChange={form.onChange('name')}
          />
          {form.errors.name && <div>{form.errors.name}</div>}
        </div>
        <button type="submit" disabled={form.isSubmitting}>
          Create
        </button>
      </form>
      <button onClick={() => projects.deleteAll()}>Delete All</button>
    </Layout>
  );
}
