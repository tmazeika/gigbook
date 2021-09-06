import { FormValueController } from 'gigbook/hooks/useForm';
import React from 'react';
import Form from 'react-bootstrap/Form';

interface Props<T extends PropertyKey> {
  className?: string;
  controller: FormValueController<T>;
  options: Record<T, string>;
}

export default function SelectInput<T extends PropertyKey>(
  props: Props<T>,
): JSX.Element {
  return (
    <Form.Select
      className={props.className}
      value={String(props.controller.value)}
      onChange={(e) => props.controller.set(e.currentTarget.value as T)}
    >
      {Object.entries(props.options).map(([k, v]) => (
        <option key={k} value={k}>
          {String(v)}
        </option>
      ))}
    </Form.Select>
  );
}
