import { Schema, string } from 'gigbook/validation';

export const nonemptyString = (): Schema<string> =>
  string()
    .withValidator((s) => s.trim().length > 0)
    .withTransform((s) => s.trim());
