import { dateTime } from 'gigbook/validation/ext';
import { DateTime } from 'luxon';

describe('DateTime validation', () => {
  const s = dateTime();

  it('validates', () => {
    expect(s.isType({ $type: 0, value: '2021-01-01' })).toBe(true);
  });
  it('rejects', () => {
    expect(s.isType('a')).toBe(false);
    expect(s.isType({ $type: 0, value: 'a' })).toBe(false);
    expect(s.isType({ $type: 1, value: '2021-01-01' })).toBe(false);
  });
  it('transforms', () => {
    expect(s.transform({ $type: 0, value: '2021-01-01' })).toEqual(
      DateTime.fromISO('2021-01-01'),
    );
  });
});
