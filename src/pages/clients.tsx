import Layout from 'gigbook/components/layout';
import useClients from 'gigbook/hooks/useClients';
import useForm from 'gigbook/hooks/useForm';

export default function Clients(): JSX.Element {
  const clients = useClients();
  const form = useForm({
    initialValues: {
      name: '',
    },
    onValidate({ name }, errors) {
      if (!name) {
        errors.name = 'Required';
      }
      if (clients.data.map((c) => c.name).includes(name)) {
        errors.name = 'Already exists';
      }
    },
    async onSubmit({ name }) {
      await clients.save({ name });
    },
  });
  return (
    <Layout>
      <h1>Clients</h1>
      <ul>
        {clients.data.map((c) => (
          <li key={c.id}>{c.name}</li>
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
      <button onClick={() => clients.deleteAll()}>Delete All</button>
    </Layout>
  );
}
