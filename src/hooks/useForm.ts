import usePromises from 'gigbook/hooks/usePromises';
import { ChangeEvent, FormEvent, useState } from 'react';

type FormErrors<FormValues> = Partial<Record<keyof FormValues, string>>;

export interface Form<FormValues> {
  values: Readonly<FormValues>;
  errors: Readonly<FormErrors<FormValues>>;
  isSubmitting: boolean;

  onChange(name: keyof FormValues): (e: ChangeEvent<HTMLInputElement>) => void;

  onSubmit(e: FormEvent<HTMLFormElement>): void;

  reset(): void;
}

export default function useForm<FormValues>(options: {
  initialValues: Readonly<FormValues>;
  onValidate?: (
    values: Readonly<FormValues>,
    errors: FormErrors<FormValues>,
  ) => void;
  onSubmit?: (values: Readonly<FormValues>) => Promise<void>;
}): Readonly<Form<FormValues>> {
  const promises = usePromises();
  const [isSubmitting, setSubmitting] = useState(false);
  const [values, setValues] = useState(options.initialValues);
  const [errors, setErrors] = useState<FormErrors<FormValues>>({});

  return {
    values,
    errors,
    isSubmitting,
    onChange(
      name: keyof FormValues,
    ): (e: ChangeEvent<HTMLInputElement>) => void {
      return (e) => {
        setValues((values) => ({
          ...values,
          [name]: e.target.value,
        }));
      };
    },
    onSubmit(e: FormEvent<HTMLFormElement>) {
      e.preventDefault();
      const errors: FormErrors<FormValues> = {};
      options.onValidate?.(values, errors);
      if (Object.values(errors).filter((e) => e !== undefined).length) {
        setErrors(errors);
        return;
      }
      setSubmitting(true);
      void promises
        .run(() => options.onSubmit?.(values) ?? Promise.resolve())
        .then(() => {
          setSubmitting(false);
          this.reset();
        });
    },
    reset() {
      setValues(options.initialValues);
      setErrors({});
    },
  };
}
