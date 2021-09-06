import usePromises from 'gigbook/hooks/usePromises';
import { SyntheticEvent, useCallback, useReducer, useState } from 'react';

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

  setMany(this: void, data: Partial<T>): void;

  control<K extends keyof T>(this: void, key: K): FormValueController<T[K]>;

  onSubmit(this: void, e?: SyntheticEvent): void;

  reset(this: void): void;
}

export default function useForm<T>({
  initialValues,
  onValidate,
  onSubmit,
}: {
  initialValues: T;
  onValidate?: (values: Readonly<T>, errors: FormErrors<T>) => void;
  onSubmit?: (values: Readonly<T>) => Promise<void> | void;
}): Form<T> {
  const promises = usePromises();
  const [values, dispatch] = useReducer(
    (state: T, action: (state: T) => T) => action(state),
    initialValues,
  );
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const [isSubmitting, setSubmitting] = useState(false);

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
    setErrors((errors) => ({
      ...errors,
      [k]: undefined,
    }));
  }, []);

  return {
    values,
    errors,
    isSubmitting,
    set,
    setMany: useCallback(
      (data: Partial<T>) =>
        Object.entries(data).forEach(([k, v]) => {
          const _k = k as keyof T;
          set(_k, v as T[typeof _k]);
        }),
      [set],
    ),
    control: useCallback(
      <K extends keyof T>(k: K): FormValueController<T[K]> => ({
        value: values[k],
        set: (v: T[K]) => set(k, v),
      }),
      [values, set],
    ),
    onSubmit: useCallback(
      (e?: SyntheticEvent) => {
        e?.preventDefault();
        const errors: FormErrors<T> = {};
        onValidate?.(values, errors);
        if (Object.values(errors).some((e) => e !== undefined)) {
          setErrors(errors);
          return;
        }
        const submit = onSubmit?.(values);
        if (submit) {
          setSubmitting(true);
          void promises.run(submit).then(() => setSubmitting(false));
        }
      },
      [onValidate, onSubmit, values, promises],
    ),
    reset: useCallback(() => {
      dispatch(() => initialValues);
      setErrors({});
    }, [initialValues]),
  };
}
