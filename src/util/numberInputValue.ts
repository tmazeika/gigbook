interface Options {
  integer?: boolean;
  positive?: boolean;
}

export default class NumberInputValue {
  private constructor(
    public readonly text: string,
    public readonly n: number,
    public readonly isValid: boolean,
  ) {}

  static fromText(text: string, options?: Options): NumberInputValue {
    const n = Number(text);
    let ok = Number.isFinite(n);
    ok &&= !options?.integer || Number.isSafeInteger(n);
    ok &&= !options?.positive || n >= 0;
    return new NumberInputValue(text, ok ? n : 0, ok);
  }

  static fromNumber(number: number): NumberInputValue {
    return new NumberInputValue(String(number), number, true);
  }

  toJSON(): number | null {
    return this.isValid ? this.n : null;
  }
}
