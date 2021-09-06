import { number } from 'gigbook/validation';

describe('number validation', () => {
  it('validates a number', () => {
    expect(number().isType(Number.MIN_VALUE)).toBe(true);
    expect(number().isType(Number.MAX_VALUE)).toBe(true);
    expect(number().isType(-32)).toBe(true);
    expect(number().isType(0)).toBe(true);
    expect(number().isType(64)).toBe(true);
  });
  it('validates a nullable number', () => {
    expect(number().nullable().isType(1)).toBe(true);
    expect(number().nullable().isType(null)).toBe(true);
    expect(number().nullable().isType(undefined)).toBe(false);
  });
  it('validates an optional number', () => {
    const s = number().optional();
    expect(s.isType(1)).toBe(true);
    expect(s.isType(null)).toBe(false);
    expect(s.isType(undefined)).toBe(true);
  });
  it('validates an optional and nullable number', () => {
    const s1 = number().nullable().optional();
    expect(s1.isType(1)).toBe(true);
    expect(s1.isType(null)).toBe(true);
    expect(s1.isType(undefined)).toBe(true);
    const s2 = number().optional().nullable();
    expect(s2.isType(1)).toBe(true);
    expect(s2.isType(null)).toBe(true);
    expect(s2.isType(undefined)).toBe(true);
  });
  it('transforms a number', () => {
    const s1 = number().withTransform((v) => v + 1);
    expect(s1.withTransform((v) => v - 1).transform(3)).toBe(3);
    expect(s1.transform(1)).toBe(2);
    const s2 = number()
      .withTransform(() => 5)
      .optional();
    expect(s2.transform(undefined)).toBe(undefined);
    expect(s2.transform(6)).toBe(5);
  });
  it('rejects a non-number', () => {
    const s = number();
    expect(s.isType(Number.NaN)).toBe(false);
    expect(s.isType(Number.NEGATIVE_INFINITY)).toBe(false);
    expect(s.isType(Number.POSITIVE_INFINITY)).toBe(false);
    expect(s.isType([])).toBe(false);
    expect(s.isType(true)).toBe(false);
    expect(s.isType({})).toBe(false);
    expect(s.isType('a')).toBe(false);
    expect(s.isType(null)).toBe(false);
    expect(s.isType(undefined)).toBe(false);
  });
  it('enforces a minimum number', () => {
    const s = number({ min: 3 });
    expect(s.isType(2)).toBe(false);
    expect(s.isType(3)).toBe(true);
    expect(s.isType(4.1)).toBe(true);
  });
  it('enforces a maximum number', () => {
    const s = number({ max: 3 });
    expect(s.isType(2.5)).toBe(true);
    expect(s.isType(3)).toBe(true);
    expect(s.isType(4)).toBe(false);
  });
  it('enforces an integer', () => {
    const s = number({ integer: true });
    expect(s.isType(2)).toBe(true);
    expect(s.isType(3)).toBe(true);
    expect(s.isType(4.5)).toBe(false);
    expect(s.isType(Number.MAX_VALUE)).toBe(false);
    expect(s.isType(Number.MIN_VALUE)).toBe(false);
    expect(s.isType(Number.MAX_SAFE_INTEGER)).toBe(true);
    expect(s.isType(Number.MIN_SAFE_INTEGER)).toBe(true);
  });
  it('can allow infinite', () => {
    const s = number({ allowInfinite: true });
    expect(s.isType(Number.POSITIVE_INFINITY)).toBe(true);
    expect(s.isType(Number.NEGATIVE_INFINITY)).toBe(true);
    expect(s.isType(3)).toBe(true);
    expect(s.isType(Number.NaN)).toBe(false);
  });
  it('enforces a minimum and maximum number', () => {
    const s = number({ min: 1, max: 3 });
    expect(s.isType(-5)).toBe(false);
    expect(s.isType(1)).toBe(true);
    expect(s.isType(2)).toBe(true);
    expect(s.isType(4)).toBe(false);
  });
});
