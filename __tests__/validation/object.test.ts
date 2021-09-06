import assert from 'assert';
import {
  array,
  boolean,
  number,
  object,
  string,
  unknown,
} from 'gigbook/validation';

describe('object validation', () => {
  const complex = object({
    str: string(),
    numStr: string({ regExp: /^[0-9]{3}$/ })
      .optional()
      .withTransform((s) => Number(s)),
    strRegExp: string({ nonempty: true, regExp: /^(abc)?$/ }),
    bool: boolean(),
    num: number({ min: 3, max: 5 }).withTransform((n) => n - 1),
    arr: array(
      number().or(string({ oneOf: ['a', 'b'] as const })),
    ).withTransform((arr) => arr.filter((v) => number().isType(v))),
    objArr: array(
      object({
        a: string(),
        b: unknown(),
      }).withTransform((obj) => obj.a),
    ),
    obj: object({
      x: number(),
      y: number().optional(),
    }),
  })
    .nullable()
    .withTransform((obj) => ({ ...obj, bool: true }));

  const complexVal = {
    str: 'a',
    strRegExp: 'abc',
    bool: true,
    num: 4,
    arr: [3, 'a', 9, 'b'],
    objArr: [
      { a: 'hi', b: 3 },
      { a: 'there', b: '' },
    ],
    obj: { x: 1 },
  };

  it('validates a simple object', () => {
    expect(object({}).isType({})).toBe(true);
    expect(object({ a: boolean() }).isType({ a: true, b: 1 })).toBe(true);
  });
  it('validates a partial object', () => {
    expect(object({}).partial().isType({})).toBe(true);
    expect(object({ a: string() }).partial().isType({})).toBe(true);
    expect(object({ a: string() }).partial().isType({ a: 'b' })).toBe(true);
    expect(object({ a: string() }).partial().isType({ a: 'b', b: 'c' })).toBe(
      true,
    );
  });
  it('validates a complex object', () => {
    expect(complex.isType(null)).toBe(true);
    expect(complex.isType(complexVal)).toBe(true);
  });
  it('transforms an object', () => {
    expect(complex.transform(null)).toEqual({ bool: true });
    assert(complex.isType(complexVal));
    expect(complex.transform({ ...complexVal, numStr: '553' })).toEqual({
      ...complexVal,
      numStr: 553,
      num: 3,
      arr: [3, 9],
      objArr: ['hi', 'there'],
      bool: true,
    });
  });
  it('rejects a bad object', () => {
    expect(complex.isType({ ...complexVal, str: 3 })).toBe(false);
    expect(complex.isType({ ...complexVal, strRegExp: '' })).toBe(false);
    expect(complex.isType({ ...complexVal, bool: null })).toBe(false);
    expect(complex.isType({ ...complexVal, num: -2 })).toBe(false);
    expect(complex.isType({ ...complexVal, num: 7 })).toBe(false);
    expect(complex.isType({ ...complexVal, num: '3' })).toBe(false);
    expect(complex.isType({ ...complexVal, arr: [true, 'a'] })).toBe(false);
    expect(complex.isType({ ...complexVal, objArr: [1] })).toBe(false);
    expect(complex.isType({ ...complexVal, objArr: [{ a: 3, b: null }] })).toBe(
      false,
    );
    expect(complex.isType({ ...complexVal, obj: { x: '1', y: 3 } })).toBe(
      false,
    );
  });
  it('rejects a bad partial object', () => {
    expect(object({ a: string() }).partial().isType({ a: 5 })).toBe(false);
    expect(
      object({ a: string(), b: number() }).partial().isType({ a: 'b', b: 'c' }),
    ).toBe(false);
  });
  it('rejects a non-object', () => {
    const s = object({ one: string(), two: number() });
    expect(s.isType([])).toBe(false);
    expect(s.isType(true)).toBe(false);
    expect(s.isType(1)).toBe(false);
    expect(s.isType('a')).toBe(false);
    expect(s.isType(null)).toBe(false);
    expect(s.isType(undefined)).toBe(false);
  });
  it('strips unknown properties', () => {
    const s = object({ a: boolean() });
    const v = { a: true, b: 3 };
    assert(s.isType(v));
    expect(s.transform(v)).toEqual({ a: true });
  });
  it('can include unknown properties', () => {
    const s = object({ a: boolean() }, { includeUnknowns: true });
    const v = { a: true, b: 3 };
    assert(s.isType(v));
    expect(s.transform(v)).toEqual({ a: true, b: 3 });
  });
});
