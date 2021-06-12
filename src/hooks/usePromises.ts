import { useEffect, useRef } from 'react';

export interface PromisesManager {
  /**
   * @param createPromise
   * @param [suppressCancel=true]
   */
  run<T>(createPromise: () => Promise<T>, suppressCancel?: boolean): Promise<T>;
}

export class CanceledError extends Error {
  constructor() {
    super('Promise was canceled');
    Object.setPrototypeOf(this, CanceledError.prototype);
  }
}

export function isCanceledError(e: unknown): e is CanceledError {
  return e instanceof CanceledError;
}

class CancelablePromise<T> extends Promise<T> {
  public cancelFn: (() => void) | undefined;

  constructor(
    executor: (
      resolve: (value: PromiseLike<T> | T) => void,
      reject: (reason?: unknown) => void,
    ) => void,
  ) {
    super(executor);
  }

  public cancel() {
    this.cancelFn?.();
  }
}

export default function usePromises(): PromisesManager {
  const promises = useRef<CancelablePromise<unknown>[]>([]);
  useEffect(
    () => () => {
      promises.current?.forEach((p) => p.cancel());
      promises.current = [];
    },
    [],
  );
  return {
    run<T>(createPromise: () => Promise<T>, suppressCancel = true) {
      const cancelable = makeCancelable(createPromise(), suppressCancel);
      promises.current.push(cancelable);
      return cancelable;
    },
  };
}

function makeCancelable<T>(
  promise: Promise<T>,
  suppressCancel: boolean,
): CancelablePromise<T> {
  let canceled = false;
  const cancelable = new CancelablePromise<T>((resolve, reject) => {
    promise
      .then((v) => {
        if (canceled && !suppressCancel) {
          reject(new CanceledError());
        } else if (!canceled) {
          resolve(v);
        }
      })
      .catch((e) => {
        if (canceled && !suppressCancel) {
          reject(new CanceledError());
        } else if (!canceled) {
          reject(e);
        }
      });
  });
  cancelable.cancelFn = () => (canceled = true);
  return cancelable;
}
