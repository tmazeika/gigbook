import { FormValueController } from 'gigbook/hooks/useForm';
import React from 'react';
import Form from 'react-bootstrap/Form';

export interface SelectInputProps<Options extends PropertyKey> {
  controller: FormValueController<Options>;
  options?: Record<Options, string>;
}

export default function SelectInput<Options extends PropertyKey>(
  props: SelectInputProps<Options>,
): JSX.Element {
  return (
    <Form.Select
      value={String(props.controller.value)}
      onChange={(e) => props.controller.set(e.currentTarget.value as Options)}
    >
      {Object.entries(props.options ?? ({} as Record<string, string>)).map(
        ([k, v]) => (
          <option key={k} value={k}>
            {v}
          </option>
        ),
      )}
    </Form.Select>
  );
}
