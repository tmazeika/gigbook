import ClockifyApiClient from 'gigbook/clockify/client';
import FormModal from 'gigbook/components/forms/FormModal';
import TextInput from 'gigbook/components/forms/TextInput';
import useSignal from 'gigbook/hooks/useSignal';
import useUser from 'gigbook/hooks/useUser';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

interface Props {
  size?: 'sm' | 'lg';
}

export default function ClockifyApiKeyButton(props: Props): JSX.Element {
  const signal = useSignal();
  const { user, update } = useUser();
  const apiKey = user?.clockifyApiKey ?? undefined;
  const [show, setShow] = useState(false);
  const [invalid, setInvalid] = useState(false);

  const onHide = () => {
    setShow(false);
    setInvalid(false);
  };

  const onSave = async (value: string): Promise<boolean> => {
    if (!user?.id) {
      return false;
    }
    if (value === apiKey) {
      return true;
    }
    if (!(await new ClockifyApiClient(value).isValid(signal))) {
      setInvalid(true);
      return false;
    }
    await update({ clockifyApiKey: value }, signal);
    return true;
  };

  return (
    <>
      <Button
        variant="secondary"
        size={props.size}
        onClick={() => setShow(true)}
      >
        Set API Key
      </Button>
      <FormModal
        title="Clockify API Key"
        initialValue={apiKey}
        show={show}
        onHide={onHide}
        onSave={onSave}
      >
        {(controller, save) => (
          <>
            <p>
              View or generate an API key in your{' '}
              <a href="https://clockify.me/user/settings">
                Clockify profile settings
              </a>
              .
            </p>
            <Form onSubmit={save}>
              <Form.Group controlId="api-key">
                <TextInput controller={controller} invalid={invalid} />
                <Form.Control.Feedback type="invalid">
                  Invalid API key.
                </Form.Control.Feedback>
              </Form.Group>
            </Form>
          </>
        )}
      </FormModal>
    </>
  );
}
