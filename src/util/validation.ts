import { Duration } from 'luxon';
import * as yup from 'yup';

export const durationString = yup
  .string()
  .test(
    'test-duration-string',
    'invalid duration',
    (value) => value !== undefined && Duration.fromISO(value).isValid,
  );
