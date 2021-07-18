import { FormValueController } from 'gigbook/hooks/useForm';
import { NumberInputValue } from 'gigbook/util/type';
import Form from 'react-bootstrap/Form';

export interface NumberInputProps {
  controller: FormValueController<NumberInputValue>;
}

export default function NumberInput(props: NumberInputProps): JSX.Element {
  return (
    <Form.Control
      type="text"
      placeholder=""
      value={props.controller.value.text}
      onChange={(e) => {
        const n = NumberInputValue.fromText(e.target.value, {
          integer: true,
          positive: true,
        });
        if (n.isValid) {
          props.controller.set(n);
        }
      }}
    />
  );
}
