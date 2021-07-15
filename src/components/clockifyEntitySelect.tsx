import { useEffect } from 'react';
import Form from 'react-bootstrap/Form';

export interface Entity {
  id: string;
  name: string;
}

export interface ClockifyEntitySelectProps<T> {
  size?: 'sm' | 'lg';
  entities: T[] | undefined;
  value?: T;
  onChange: (value?: T) => void;
}

export default function ClockifyEntitySelect<T extends Entity>(
  props: ClockifyEntitySelectProps<T>,
): JSX.Element {
  const { onChange } = props;
  const entity0 = props.entities?.[0];
  useEffect(() => {
    if (entity0) {
      onChange(entity0);
    }
  }, [onChange, entity0]);
  return (
    <Form.Select
      size={props.size}
      style={{ minWidth: '10em' }}
      placeholder=""
      disabled={!props.entities?.length}
      value={props.value?.id}
      onChange={(evt) =>
        props.onChange(
          props.entities?.find((e) => e.id === evt.currentTarget.value),
        )
      }
    >
      {props.entities?.map((e) => (
        <option key={e.id} value={e.id}>
          {e.name}
        </option>
      ))}
    </Form.Select>
  );
}
