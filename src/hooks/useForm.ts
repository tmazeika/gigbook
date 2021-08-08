import usePromises from 'gigbook/hooks/usePromises';
import { FormEvent, useCallback, useEffect, useReducer, useState } from 'react';

export interface FormValueController<T> {
  readonly value: Readonly<T>;

  set(value: T): void;
}

export type FormErrors<T> = Partial<Record<keyof T, string>>;

export interface Form<T> {
  readonly values: Readonly<T>;
  readonly errors: Readonly<FormErrors<T>>;
  readonly isSubmitting: boolean;

  set<K extends keyof T>(this: void, key: K, value: T[K]): void;

  prefill(this: void, data: Partial<T>): void;

  control<K extends keyof T>(this: void, key: K): FormValueController<T[K]>;

  onSubmit(this: void, e: FormEvent<HTMLFormElement>): void;

  reset(this: void): void;
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

  const set = useCallback(<K extends keyof T>(k: K, v: T[K]) => {
    dispatch((state) => {
      if (Object.is(state[k], v)) {
        return state;
      }
      return {
        ...state,
        [k]: v,
      };
    });
  }, []);
  const prefill = useCallback(
    (data: Partial<T>) =>
      Object.entries(data).forEach(([k, v]) => {
        const _k = k as keyof T;
        set(_k, v as T[typeof _k]);
      }),
    [set],
  );

  useEffect(
    () => dispatch(() => options.initialValues),
    [options.initialValues],
  );

  return {
    values,
    errors,
    isSubmitting,
    set,
    prefill,
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
        void promises.run(submitPromise).then(() => setSubmitting(false));
      }
    },
    reset() {
      dispatch(() => options.initialValues);
      setErrors({});
    },
  };
}
