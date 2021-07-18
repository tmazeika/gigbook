import { FormValueController } from 'gigbook/hooks/useForm';
import { DateTime } from 'luxon';
import { useState } from 'react';
import Form from 'react-bootstrap/Form';

export interface DateInputProps {
  controller: FormValueController<DateTime>;
  min?: DateTime;
  max?: DateTime;
}

export default function DateInput(props: DateInputProps): JSX.Element {
  const [initialValue] = useState(props.controller.value);
  return (
    <Form.Control
      type="date"
      placeholder=""
      min={props.min?.toISODate()}
      max={props.max?.toISODate()}
      value={props.controller.value.toISODate()}
      onChange={(e) => {
        const { value } = e.target;
        if (value === '') {
          props.controller.set(initialValue);
        } else {
          const parsed = DateTime.fromISO(value, { zone: 'system' });
          if (parsed.isValid) {
            props.controller.set(parsed);
          }
        }
      }}
    />
  );
}
