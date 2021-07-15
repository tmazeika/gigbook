import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';

export interface FormControlModalProps {
  title: string;
  initialValue?: string;
  show: boolean;
  onHide: () => void;
  onSave: (value: string) => boolean | Promise<boolean>;
  children: (
    value: string,
    setValue: (value: string) => void,
    save: () => Promise<boolean>,
  ) => React.ReactNode;
}

export default function FormControlModal(
  props: FormControlModalProps,
): JSX.Element {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSave(): Promise<boolean> {
    setLoading(true);
    const ok = await props.onSave(value);
    if (ok) {
      props.onHide();
    }
    setLoading(false);
    return ok;
  }

  return (
    <Modal
      size="lg"
      show={props.show}
      onHide={() => props.onHide()}
      onEnter={() => setValue(props.initialValue ?? '')}
    >
      <Modal.Header closeButton>{props.title}</Modal.Header>
      <Modal.Body>
        {props.children(
          value,
          (value) => setValue(value),
          () => onSave(),
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={() => props.onHide()}>
          Cancel
        </Button>
        <Button variant="primary" disabled={loading} onClick={() => onSave()}>
          {loading ? (
            <>
              <Spinner
                className="me-1"
                as="span"
                animation="border"
                size="sm"
              />
              {' Saving...'}
            </>
          ) : (
            'Save'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
