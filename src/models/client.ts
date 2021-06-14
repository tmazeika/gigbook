export interface UnsavedClient {
  userId?: number;
  clockifyId: number;
  address: unknown;
  billingIncrement: number;
  billingNetDays: number;
  billingCurrency: string;
  bankId?: number;
}

export interface Client extends UnsavedClient {
  id: number;
}

export function isValidUnsavedClient(v: unknown): v is UnsavedClient {
  return isUnsavedClient(v) && isValid(v);
}

// TODO: fix

function isUnsavedClient(v: unknown): v is UnsavedClient {
  return typeof (v as UnsavedClient)?.billingCurrency === 'string';
}

function isValid({ billingCurrency }: UnsavedClient): boolean {
  return 1 <= billingCurrency.length && billingCurrency.length <= 255;
}
