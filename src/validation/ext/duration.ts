import { DurationTypeMeta, Type } from 'gigbook/json/types';
import { number, object, Schema, string } from 'gigbook/validation';
import { Duration } from 'luxon';

interface Options {
  min?: Duration;
  max?: Duration;
}

export const duration = (
  options?: Options,
): Schema<DurationTypeMeta, Duration> =>
  object({
    $type: number({ eq: Type.Duration as const }),
    value: string().withValidator((s) => {
      const parsed = Duration.fromISO(s);
      let ok = parsed.isValid;
      ok &&= options?.min === undefined || parsed >= options.min;
      ok &&= options?.max === undefined || parsed <= options.max;
      return ok;
    }),
  }).withTransform((obj) => Duration.fromISO(obj.value));
