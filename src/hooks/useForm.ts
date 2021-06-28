import usePromises from 'gigbook/hooks/usePromises';
import { FormEvent, useReducer, useState } from 'react';

type FormErrors<FormValues> = Partial<Record<keyof FormValues, string>>;

type DispatchAction<FormValues> = (state: FormValues) => FormValues;

function createAction<FormValues, K extends keyof FormValues>(
  key: K,
  value: FormValues[K],
): DispatchAction<FormValues> {
  return (state) => {
    if (Object.is(state[key], value)) {
      return state;
    }
    return {
      ...state,
      [key]: value,
    };
  };
}

export interface Form<FormValues> {
  readonly values: Readonly<FormValues>;
  readonly errors: Readonly<FormErrors<FormValues>>;
  readonly isSubmitting: boolean;

  set<K extends keyof FormValues>(key: K, value: FormValues[K]): void;

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
}): Form<FormValues> {
  const promises = usePromises();
  const [isSubmitting, setSubmitting] = useState(false);
  const [values, dispatch] = useReducer(
    (state: FormValues, action: DispatchAction<FormValues>) => action(state),
    options.initialValues,
  );
  const [errors, setErrors] = useState<FormErrors<FormValues>>({});

  return {
    values,
    errors,
    isSubmitting,
    set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
      dispatch(createAction(key, value));
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
      dispatch(() => options.initialValues);
      setErrors({});
    },
  };
}
