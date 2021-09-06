import { SyntheticEvent } from 'react';
import Form from 'react-bootstrap/Form';
import styled from 'styled-components';

const FormSelect = styled(Form.Select)`
  min-width: 10em;
`;

interface Entity {
  id: string;
  name: string;
}

interface Props<T> {
  size?: 'sm' | 'lg';
  entities: T[] | undefined;
  value?: T;

  onChange?(value?: T): void;
}

export default function ClockifySelectInput<T extends Entity>(
  props: Props<T>,
): JSX.Element {
  const onChange = (e: SyntheticEvent<HTMLSelectElement>): void => {
    props.onChange?.(
      props.entities?.find((entity) => entity.id === e.currentTarget.value),
    );
  };

  return (
    <FormSelect
      size={props.size}
      placeholder=""
      disabled={!props.entities?.length}
      value={props.value?.id ?? ''}
      onChange={onChange}
    >
      {props.entities &&
        props.entities.map((e) => (
          <option key={e.id} value={e.id}>
            {e.name}
          </option>
        ))}
    </FormSelect>
  );
}
