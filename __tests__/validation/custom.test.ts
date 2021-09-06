import { custom } from 'gigbook/validation';

describe('custom validation', () => {
  const string = custom((v) => (typeof v === 'string' ? v : undefined));
  const number = custom((v) => (typeof v === 'number' ? v : undefined));

  it('validates', () => {
    expect(string.isType('a')).toBe(true);
    expect(number.isType(1)).toBe(true);
  });
  it('rejects', () => {
    expect(number.isType('a')).toBe(false);
    expect(string.isType(1)).toBe(false);
  });
  it('transforms', () => {
    expect(number.withTransform((n) => n + 1).transform(3)).toBe(4);
    expect(string.withTransform((s) => s.trim()).transform(' a')).toBe('a');
  });
});
