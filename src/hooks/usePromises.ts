import { useEffect, useRef } from 'react';

export interface PromisesManager {
  /**
   * @param promise
   * @param [suppressCancel=true]
   */
  run<T>(promise: Promise<T>, suppressCancel?: boolean): Promise<T>;
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
  isCanceled = false;
  cancelFn?: () => void;

  constructor(
    executor: (
      resolve: (value: PromiseLike<T> | T) => void,
      reject: (reason?: unknown) => void,
    ) => void,
  ) {
    super(executor);
  }

  cancel() {
    this.isCanceled = true;
    this.cancelFn?.();
  }
}

export default function usePromises(): PromisesManager {
  const trackedRef = useRef<CancelablePromise<unknown>[]>([]);
  useEffect(
    () => () => {
      trackedRef.current?.forEach((p) => p.cancel());
      trackedRef.current = [];
    },
    [],
  );
  return {
    run<T>(promise: Promise<T>, suppressCancel = true) {
      const cancelable = makeCancelable(promise, suppressCancel);
      const tracked = trackedRef.current;
      tracked.push(cancelable);
      return cancelable.finally(() => {
        if (!cancelable.isCanceled) {
          tracked.splice(tracked.indexOf(cancelable), 1);
        }
      });
    },
  };
}

function makeCancelable<T>(
  promise: Promise<T>,
  suppressCancel: boolean,
): CancelablePromise<T> {
  let canceled = false;
  const cancelable = new CancelablePromise<T>((resolve, reject) => {
    const handle =
      <R>(fn: (v: R) => void) =>
      (v: R) => {
        if (canceled && !suppressCancel) {
          reject(new CanceledError());
        } else if (!canceled) {
          fn(v);
        }
      };
    promise.then(handle(resolve)).catch(handle(reject));
  });
  cancelable.cancelFn = () => (canceled = true);
  return cancelable;
}
