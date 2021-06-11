import Layout from 'gigbook/components/layout';
import useClients from 'gigbook/hooks/useClients';
import useForm from 'gigbook/hooks/useForm';
import usePromises from 'gigbook/hooks/usePromises';
import { useState } from 'react';

export default function Clients(): JSX.Element {
  const [submitting, setSubmitting] = useState(false);
  const promises = usePromises();
  const form = useForm({
    name: '',
  });
  const clients = useClients();
  return (
    <Layout>
      <h1>Clients</h1>
      <ul>
        {clients.data.map((c) => (
          <li key={c.id}>{c.name}</li>
        ))}
      </ul>
      <hr />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitting(true);
          const { name } = form.values;
          let errors = false;
          if (!name) {
            form.setError('name', 'Required');
            errors = true;
          }
          if (clients.data.map((c) => c.name).includes(name)) {
            form.setError('name', 'Already exists');
            errors = true;
          }
          if (!errors) {
            form.reset();
            void promises.run(async () => {
              await clients.save({ name });
              setSubmitting(false);
            });
          } else {
            setSubmitting(false);
          }
        }}
      >
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            maxLength={255}
            autoComplete="off"
            value={form.values.name}
            onChange={form.onChange('name')}
          />
          {form.errors.name && <div>{form.errors.name}</div>}
        </div>
        <button type="submit" disabled={submitting}>
          Create
        </button>
      </form>
    </Layout>
  );
}
