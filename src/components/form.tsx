import { FormValueController } from 'gigbook/hooks/useForm';
import useId from 'gigbook/hooks/useId';
import { NumberInputValue } from 'gigbook/util/type';
import { DateTime } from 'luxon';
import React from 'react';

export type InputAttributes = React.InputHTMLAttributes<HTMLInputElement>;

export interface StringInputProps {
  controller: FormValueController<string>;
  label: string;
  maxLength?: InputAttributes['maxLength'];
  disabled?: InputAttributes['disabled'];
}

export function TextInput(props: StringInputProps): JSX.Element {
  const id = useId();
  return (
    <div>
      <label htmlFor={id}>{props.label}</label>
      <input
        id={id}
        type="text"
        maxLength={props.maxLength}
        disabled={props.disabled}
        value={props.controller.value}
        onChange={(e) => props.controller.set(e.target.value)}
      />
    </div>
  );
}

export interface DateInputProps {
  controller: FormValueController<DateTime>;
  label: string;
  disabled?: InputAttributes['disabled'];
}

export function DateInput(props: DateInputProps): JSX.Element {
  const id = useId();
  return (
    <div>
      <label htmlFor={id}>{props.label}</label>
      <input
        id={id}
        type="date"
        disabled={props.disabled}
        value={props.controller.value.toISODate()}
        onChange={(e) => {
          const date = DateTime.fromISO(e.target.value, { zone: 'local' });
          if (date.isValid) {
            props.controller.set(date);
          }
        }}
      />
    </div>
  );
}

export interface NumberInputProps {
  controller: FormValueController<NumberInputValue>;
  label: string;
  integer?: boolean;
  positive?: boolean;
  disabled?: InputAttributes['disabled'];
}

export function NumberInput(props: NumberInputProps): JSX.Element {
  const id = useId();
  return (
    <div>
      <label htmlFor={id}>{props.label}</label>
      <input
        id={id}
        type="text"
        disabled={props.disabled}
        value={props.controller.value.text}
        onChange={(e) => {
          const v = NumberInputValue.fromText(e.target.value, {
            integer: props.integer,
            positive: props.positive,
          });
          if (v.isValid) {
            props.controller.set(v);
          }
        }}
      />
    </div>
  );
}
