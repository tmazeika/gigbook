import { boolean } from 'gigbook/validation';

describe('boolean validation', () => {
  it('validates a boolean', () => {
    expect(boolean().isType(true)).toBe(true);
    expect(boolean().isType(false)).toBe(true);
  });
  it('validates a boolean with a custom validator', () => {
    expect(
      boolean()
        .withValidator((b) => !b)
        .isType(true),
    ).toBe(false);
    expect(
      boolean()
        .withValidator((b) => !b)
        .isType(false),
    ).toBe(true);
  });
  it('validates a nullable boolean', () => {
    expect(boolean().nullable().isType(true)).toBe(true);
    expect(boolean().nullable().isType(false)).toBe(true);
    expect(boolean().nullable().isType(null)).toBe(true);
    expect(boolean().nullable().isType(undefined)).toBe(false);
  });
  it('validates an optional boolean', () => {
    const s = boolean().optional();
    expect(s.isType(true)).toBe(true);
    expect(s.isType(false)).toBe(true);
    expect(s.isType(null)).toBe(false);
    expect(s.isType(undefined)).toBe(true);
  });
  it('validates an optional and nullable boolean', () => {
    const s1 = boolean().nullable().optional();
    expect(s1.isType(true)).toBe(true);
    expect(s1.isType(false)).toBe(true);
    expect(s1.isType(null)).toBe(true);
    expect(s1.isType(undefined)).toBe(true);
    const s2 = boolean().optional().nullable();
    expect(s2.isType(true)).toBe(true);
    expect(s2.isType(false)).toBe(true);
    expect(s2.isType(null)).toBe(true);
    expect(s2.isType(undefined)).toBe(true);
  });
  it('transforms a boolean', () => {
    const s1 = boolean().withTransform((v) => !v);
    expect(s1.withTransform((v) => !v).transform(true)).toBe(true);
    expect(s1.transform(true)).toBe(false);
    expect(s1.transform(false)).toBe(true);
    const s2 = boolean()
      .withTransform(() => 1)
      .optional();
    expect(s2.transform(undefined)).toBe(undefined);
    expect(s2.transform(false)).toBe(1);
    const s3 = boolean()
      .optional()
      .withTransform(() => undefined);
    expect(s3.transform(true)).toBe(undefined);
    expect(s3.transform(undefined)).toBe(undefined);
    const s4 = boolean().withTransform(() => undefined);
    expect(s4.transform(true)).toBe(undefined);
  });
  it('rejects a non-boolean', () => {
    const s = boolean();
    expect(s.isType([])).toBe(false);
    expect(s.isType(1)).toBe(false);
    expect(s.isType({})).toBe(false);
    expect(s.isType('a')).toBe(false);
    expect(s.isType(null)).toBe(false);
    expect(s.isType(undefined)).toBe(false);
  });
});
