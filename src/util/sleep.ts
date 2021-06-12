/**
 * Returns a promise that sleeps for a given number of milliseconds. Useful for
 * development.
 *
 * @param ms Time to sleep in milliseconds.
 */
export default function sleep(ms = 5000): Promise<void> {
  return new Promise((resolve) => setTimeout(() => resolve(), ms));
}
