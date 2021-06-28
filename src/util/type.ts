/**
 * Extracts the keys of `T` that have values of type `V`.
 */
export type KeysMatching<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];

/**
 * Extracts the entries of `T` that have values of type `V`.
 */
export type EntriesMatching<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K];
};
