import usePromises from 'gigbook/hooks/usePromises';
import { FormEvent, useReducer, useState } from 'react';

export interface FormValueController<T> {
  readonly value: Readonly<T>;

  set(value: Readonly<T>): void;
}

export type FormErrors<T> = Partial<Record<keyof T, string>>;

export interface Form<T> {
  readonly values: Readonly<T>;
  readonly errors: Readonly<FormErrors<T>>;
  readonly isSubmitting: boolean;

  set<K extends keyof T>(key: K, value: T[K]): void;

  control<K extends keyof T>(key: K): FormValueController<T[K]>;

  onSubmit(e: FormEvent<HTMLFormElement>): void;

  reset(): void;
}

export default function useForm<T>(options: {
  initialValues: T;
  onValidate?: (values: Readonly<T>, errors: FormErrors<T>) => void;
  onSubmit?: (values: Readonly<T>) => Promise<void> | void;
}): Form<T> {
  const promises = usePromises();
  const [isSubmitting, setSubmitting] = useState(false);
  const [values, dispatch] = useReducer(
    (state: T, action: (state: T) => T) => action(state),
    options.initialValues,
  );
  const [errors, setErrors] = useState<FormErrors<T>>({});

  function set<K extends keyof T>(k: K, v: T[K]): void {
    if (!Object.is(values[k], v)) {
      dispatch((state) => ({
        ...state,
        [k]: v,
      }));
    }
  }

  return {
    values,
    errors,
    isSubmitting,
    set,
    control: <K extends keyof T>(k: K): FormValueController<T[K]> => ({
      value: values[k],
      set: (v: T[K]) => set(k, v),
    }),
    onSubmit(e: FormEvent<HTMLFormElement>) {
      e.preventDefault();
      const errors: FormErrors<T> = {};
      options.onValidate?.(values, errors);
      if (Object.values(errors).some((e) => e !== undefined)) {
        setErrors(errors);
        return;
      }
      const submitPromise = options.onSubmit?.(values);
      if (submitPromise) {
        setSubmitting(true);
        void promises.run(submitPromise).then(() => {
          setSubmitting(false);
          // this.reset();
        });
      } else {
        // this.reset();
      }
    },
    reset() {
      dispatch(() => options.initialValues);
      setErrors({});
    },
  };
}
