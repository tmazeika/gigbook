import { ChangeEvent, useState } from 'react';

type FormErrors<FormValues> = Partial<Record<keyof FormValues, string>>;

interface Form<FormValues> {
  values: FormValues;
  errors: FormErrors<FormValues>;

  setError(key: keyof FormErrors<FormValues>, value: string): void;

  onChange(name: keyof FormValues): (e: ChangeEvent<HTMLInputElement>) => void;

  reset(): void;
}

export default function useForm<FormValues>(
  initialValues: FormValues,
): Form<FormValues> {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FormErrors<FormValues>>({});

  return {
    values,
    errors,
    setError(key: keyof FormErrors<FormValues>, value: string) {
      setErrors((errors) => ({
        ...errors,
        [key]: value,
      }));
    },
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
    reset() {
      setValues(initialValues);
      setErrors({});
    },
  };
}
