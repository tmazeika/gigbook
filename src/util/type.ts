const numberParts = new Intl.NumberFormat().formatToParts(-1.1);
const decimalStr = numberParts.find((v) => v.type === 'decimal')?.value;
const negativeStr = numberParts.find((v) => v.type === 'minusSign')?.value;

function isInteger(text: string, n: number): boolean {
  return !text.includes(decimalStr ?? '.') && Number.isSafeInteger(n);
}

function isPositive(text: string, n: number): boolean {
  return !text.includes(negativeStr ?? '-') && n >= 0;
}

export class NumberInputValue {
  readonly text: string;
  readonly n?: number | null;
  readonly isValid: boolean;

  private constructor(text: string, n?: number | null) {
    this.text = text;
    this.n = n;
    this.isValid = n !== undefined;
  }

  static fromText(
    text: string,
    {
      integer = false,
      positive = false,
    }: { integer?: boolean; positive?: boolean } = {},
  ): NumberInputValue {
    if (text === '') {
      return new NumberInputValue(text, null);
    }
    const n = Number(text);
    if (
      Number.isFinite(n) &&
      (!integer || isInteger(text, n)) &&
      (!positive || isPositive(text, n))
    ) {
      return new NumberInputValue(text, n);
    }
    return new NumberInputValue(text, undefined);
  }

  static fromNumber(number: number | null): NumberInputValue {
    return new NumberInputValue(String(number ?? ''), number);
  }
}

export type AllOrNone<T> =
  | T
  | {
      [K in keyof T]?: undefined;
    };
