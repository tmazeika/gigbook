import ClientDialog from 'gigbook/components/clients/ClientDialog';
import LoadingButton from 'gigbook/components/forms/LoadingButton';
import Layout from 'gigbook/components/Layout';
import useClients from 'gigbook/hooks/useClients';
import useSignal from 'gigbook/hooks/useSignal';
import { isApiError } from 'gigbook/models/apiResponse';
import { Client } from 'gigbook/models/client';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import styled from 'styled-components';

const MultilineTd = styled.td`
  white-space: pre-wrap;
`;

const ButtonsContainer = styled.div`
  display: flex;
  column-gap: 1rem;
`;

const LinkButton = styled(Button).attrs({
  variant: 'link',
  size: 'sm',
})`
  padding: 0;
`;

const LinkLoadingButton = styled(LoadingButton).attrs({
  variant: 'link',
  size: 'sm',
})`
  padding: 0;
`;

export default function Clients(): JSX.Element {
  const signal = useSignal();
  const { clients, create, update, deleteOne } = useClients();
  const [editingClient, setEditingClient] = useState<Client>();
  const [creatingClient, setCreatingClient] = useState(false);
  const [error, setError] = useState<string>();

  return (
    <>
      <Layout>
        <Table className="mb-3">
          <thead>
            <tr>
              <th>Name</th>
              <th>Currency</th>
              <th>Address</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {clients?.map((client) => (
              <tr key={client.id}>
                <td>{client.name}</td>
                <td>{client.currency.toUpperCase()}</td>
                <MultilineTd>{client.address}</MultilineTd>
                <td>
                  <ButtonsContainer>
                    <LinkButton onClick={() => setEditingClient(client)}>
                      Edit
                    </LinkButton>
                    <LinkLoadingButton
                      langVariant="delete"
                      onClick={() => {
                        if (!client.id) {
                          return;
                        }
                        void deleteOne(client.id, signal);
                      }}
                    />
                  </ButtonsContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button onClick={() => setCreatingClient(true)}>Create</Button>
      </Layout>
      {editingClient && (
        <ClientDialog
          variant="edit"
          initialValue={editingClient}
          error={error}
          onCancel={() => {
            setEditingClient(undefined);
            setError(undefined);
          }}
          onSave={async (newClient) => {
            if (!editingClient?.id) {
              return;
            }
            setError(undefined);
            update(editingClient.id, newClient, signal)
              .then(() => {
                setEditingClient(undefined);
                setError(undefined);
              })
              .catch((err) => {
                if (!isApiError(err)) {
                  throw err;
                }
                setError(err.message);
              });
          }}
        />
      )}
      {creatingClient && (
        <ClientDialog
          variant="create"
          error={error}
          onCancel={() => {
            setCreatingClient(false);
            setError(undefined);
          }}
          onSave={(newClient) => {
            setError(undefined);
            create({ ...newClient, id: undefined }, signal)
              .then(() => {
                setCreatingClient(false);
                setError(undefined);
              })
              .catch((err) => {
                if (!isApiError(err)) {
                  throw err;
                }
                setError(err.message);
              });
          }}
        />
      )}
    </>
  );
}
