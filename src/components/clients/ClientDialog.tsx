import CurrencySelectInput from 'gigbook/components/forms/CurrencySelectInput';
import LoadingButton from 'gigbook/components/forms/LoadingButton';
import useForm from 'gigbook/hooks/useForm';
import { Client } from 'gigbook/models/client';
import { Currency } from 'gigbook/models/currency';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';

const dictionary = {
  create: {
    title: 'Create',
    action: 'create',
  },
  edit: {
    title: 'Edit',
    action: 'save',
  },
} as const;

export type Props = (
  | {
      variant: 'create';
    }
  | {
      variant: 'edit';
      initialValue: Client;
    }
) & {
  error?: string | null;

  onCancel(): void;

  onSave(newClient: Omit<Client, 'id'>): void | Promise<void>;
};

export default function ClientDialog(props: Props): JSX.Element {
  const form = useForm({
    initialValues:
      props.variant === 'create'
        ? {
            name: '',
            currency: 'usd' as Currency,
            address: '',
          }
        : {
            name: props.initialValue.name,
            currency: props.initialValue.currency,
            address: props.initialValue.address,
          },
    onValidate(values, errors) {
      if (!values.name.trim()) {
        errors.name = 'Name is required';
      }
      if (!values.address.trim()) {
        errors.address = 'Address is required';
      }
    },
    onSubmit: props.onSave,
  });

  return (
    <Modal show={true} onHide={props.onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>{dictionary[props.variant].title} Client</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={form.onSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} controlId="client-dialog-name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={form.values.name}
                onChange={(e) => form.set('name', e.target.value)}
                isInvalid={!!form.errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {form.errors.name}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} controlId="client-dialog-currency">
              <Form.Label>Currency</Form.Label>
              <CurrencySelectInput controller={form.control('currency')} />
            </Form.Group>
          </Row>
          <Form.Group controlId="client-dialog-address">
            <Form.Label>Address</Form.Label>
            <Form.Control
              as="textarea"
              style={{ height: '10em' }}
              value={form.values.address}
              onChange={(e) => form.set('address', e.target.value)}
              isInvalid={!!form.errors.address}
            />
            <Form.Control.Feedback type="invalid">
              {form.errors.address}
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {props.error && (
          <span className="me-3 text-danger">Error: {props.error}</span>
        )}
        <Button variant="outline-secondary" onClick={props.onCancel}>
          Cancel
        </Button>
        <LoadingButton
          langVariant={dictionary[props.variant].action}
          loading={form.isSubmitting}
          onClick={form.onSubmit}
        />
      </Modal.Footer>
    </Modal>
  );
}
