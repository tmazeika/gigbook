import Clockify from 'gigbook/clockify/client';
import FormControlModal from 'gigbook/components/formControlModal';
import useClockifyApiKey from 'gigbook/hooks/useClockifyApiKey';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export interface UpdateApiKeyButtonProps {
  size?: 'sm' | 'lg';
}

export default function ClockifyApiKeyButton(
  props: UpdateApiKeyButtonProps,
): JSX.Element {
  const apiKey = useClockifyApiKey();
  const [show, setShow] = useState(false);
  const [invalid, setInvalid] = useState(false);

  return (
    <>
      <Button
        variant="secondary"
        size={props.size}
        onClick={() => setShow(true)}
      >
        Set API Key
      </Button>
      <FormControlModal
        title="Clockify API Key"
        initialValue={apiKey.value}
        show={show}
        onHide={() => {
          setShow(false);
          setInvalid(false);
        }}
        onSave={async (value) => {
          if (value === apiKey.value) {
            return true;
          }
          if (await new Clockify(value).isValid()) {
            await apiKey.update(value);
            return true;
          }
          setInvalid(true);
          return false;
        }}
      >
        {(value, setValue, save) => (
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
                <Form.Control
                  type="text"
                  value={value}
                  onChange={(e) => {
                    setValue(e.target.value);
                    setInvalid(false);
                  }}
                  isInvalid={invalid}
                />
                <Form.Control.Feedback type="invalid">
                  Invalid API key.
                </Form.Control.Feedback>
              </Form.Group>
            </Form>
          </>
        )}
      </FormControlModal>
    </>
  );
}
