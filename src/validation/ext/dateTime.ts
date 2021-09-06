import { DateTimeTypeMeta, Type } from 'gigbook/json/types';
import { number, object, Schema, string } from 'gigbook/validation';
import { DateTime } from 'luxon';

interface Options {
  min?: DateTime;
  max?: DateTime;
}

export const dateTime = (
  options?: Options,
): Schema<DateTimeTypeMeta, DateTime> =>
  object({
    $type: number({ eq: Type.DateTime as const }),
    value: string().withValidator((s) => {
      const parsed = DateTime.fromISO(s);
      let ok = parsed.isValid;
      ok &&= options?.min === undefined || parsed >= options.min;
      ok &&= options?.max === undefined || parsed <= options.max;
      return ok;
    }),
  }).withTransform((obj) => DateTime.fromISO(obj.value));
