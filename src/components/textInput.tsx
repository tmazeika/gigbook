import { FormValueController } from 'gigbook/hooks/useForm';
import Form from 'react-bootstrap/Form';

export interface TextInputProps {
  controller: FormValueController<string>;
  textArea?: boolean;
}

export default function TextInput(props: TextInputProps): JSX.Element {
  return (
    <Form.Control
      as={props.textArea ? 'textarea' : undefined}
      type="text"
      placeholder=""
      style={props.textArea ? { height: '8em' } : undefined}
      value={props.controller.value}
      onChange={(e) => props.controller.set(e.target.value)}
    />
  );
}
