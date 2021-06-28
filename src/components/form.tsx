import { Form } from 'gigbook/hooks/useForm';
import useId from 'gigbook/hooks/useId';
import { KeysMatching } from 'gigbook/util/type';
import React from 'react';

export type InputAttributes = React.InputHTMLAttributes<HTMLInputElement>;

export interface StringInputProps<FormValues> {
  form: Form<FormValues>;
  formKey: KeysMatching<FormValues, string>;
  label: string;
  maxLength?: InputAttributes['maxLength'];
  disabled?: InputAttributes['disabled'];
}

export function TextInput<FormValues>(
  props: StringInputProps<FormValues>,
): JSX.Element {
  const id = useId();
  return (
    <div>
      <label htmlFor={id}>{props.label}</label>
      <input
        id={id}
        type="text"
        maxLength={props.maxLength}
        disabled={props.disabled}
        value={props.form.values[props.formKey]}
        onChange={(e) => props.form.set(props.formKey, e.target.value)}
      />
    </div>
  );
}

export function DateInput<FormValues>(
  props: StringInputProps<FormValues>,
): JSX.Element {
  const id = useId();
  return (
    <div>
      <label htmlFor={id}>{props.label}</label>
      <input
        id={id}
        type="date"
        disabled={props.disabled}
        value={props.form.values[props.formKey]}
        onChange={props.form.onChange(props.formKey)}
      />
    </div>
  );
}

export interface NumberInputProps<FormValues> {
  form: Form<FormValues>;
  formKey: KeysMatching<FormValues, number | null>;
  label: string;
  disabled?: InputAttributes['disabled'];
}

export function NumberInput<FormValues>(
  props: NumberInputProps<FormValues>,
): JSX.Element {
  const id = useId();
  return (
    <div>
      <label htmlFor={id}>{props.label}</label>
      <input
        id={id}
        type="number"
        disabled={props.disabled}
        value={props.form.values[props.formKey] ?? ''}
        onChange={(e) => {
          const { value } = e.target;
          const n = value !== '' ? Number(value) : null;
          if (n === null || Number.isFinite(n)) {
            props.form.set(props.formKey, n);
          }
        }}
      />
    </div>
  );
}
