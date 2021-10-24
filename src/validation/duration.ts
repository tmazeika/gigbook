import { $custom, Schema } from 'jval';
import { Duration, DurationLike } from 'luxon';

export const $duration = (options?: { min?: DurationLike }): Schema<Duration> =>
  $custom(Duration.isDuration).thenValidate(
    (v) =>
      v.isValid &&
      (options?.min !== undefined
        ? v.minus(options.min).milliseconds >= 0
        : true),
  );
