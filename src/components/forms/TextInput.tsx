import { FormValueController } from 'gigbook/hooks/useForm';
import Form from 'react-bootstrap/Form';

interface Props {
  controller: FormValueController<string>;
  textArea?: boolean;
  invalid?: boolean;
}

export default function TextInput(props: Props): JSX.Element {
  return (
    <Form.Control
      as={props.textArea ? 'textarea' : undefined}
      type="text"
      placeholder=""
      style={props.textArea ? { height: '8em' } : undefined}
      value={props.controller.value}
      onChange={(e) => props.controller.set(e.target.value)}
      isInvalid={props.invalid}
    />
  );
}
