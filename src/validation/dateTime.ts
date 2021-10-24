import { $custom, Schema } from 'jval';
import { DateTime } from 'luxon';

export const $dateTime = (): Schema<DateTime> =>
  $custom(DateTime.isDateTime).thenValidate((v) => v.isValid);
