import { FormValueController } from 'gigbook/hooks/useForm';
import NumberInputValue from 'gigbook/util/numberInputValue';
import Form from 'react-bootstrap/Form';

interface Props {
  controller: FormValueController<NumberInputValue>;
}

export default function NumberInput(props: Props): JSX.Element {
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
