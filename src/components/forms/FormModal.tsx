import LoadingButton from 'gigbook/components/forms/LoadingButton';
import { FormValueController } from 'gigbook/hooks/useForm';
import useSignal from 'gigbook/hooks/useSignal';
import React, { SyntheticEvent, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

interface Props {
  title: string;
  initialValue?: string;
  show: boolean;

  onHide(): void;

  onSave(value: string): boolean | Promise<boolean>;

  children?(
    controller: FormValueController<string>,
    save: (e?: SyntheticEvent) => Promise<boolean>,
  ): React.ReactNode;
}

export default function FormModal(props: Props): JSX.Element {
  const signal = useSignal();
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const controller: FormValueController<string> = {
    value,
    set: setValue,
  };

  async function onSave(e?: SyntheticEvent): Promise<boolean> {
    e?.preventDefault();
    e?.stopPropagation();
    setLoading(true);
    const ok = await props.onSave(value);
    if (signal.aborted) {
      return false;
    }
    setLoading(false);
    if (ok) {
      props.onHide();
    }
    return ok;
  }

  return (
    <Modal
      size="lg"
      show={props.show}
      onHide={props.onHide}
      onEnter={() => setValue(props.initialValue ?? '')}
    >
      <Modal.Header closeButton>{props.title}</Modal.Header>
      <Modal.Body>{props.children?.(controller, onSave)}</Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={props.onHide}>
          Cancel
        </Button>
        <LoadingButton
          variant="primary"
          langVariant="save"
          loading={loading}
          onClick={onSave}
        />
      </Modal.Footer>
    </Modal>
  );
}
