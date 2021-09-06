import Fraction from 'fraction.js';
import { fraction } from 'gigbook/validation/ext';

describe('Fraction validation', () => {
  const s = fraction();

  it('validates', () => {
    expect(s.isType({ $type: 2, value: '1/2' })).toBe(true);
  });
  it('rejects', () => {
    expect(s.isType('a')).toBe(false);
    expect(s.isType({ $type: 2, value: 'a' })).toBe(false);
    expect(s.isType({ $type: 1, value: '1/2' })).toBe(false);
  });
  it('transforms', () => {
    expect(s.transform({ $type: 2, value: '3/4' })).toEqual(
      new Fraction('3/4'),
    );
  });
});
