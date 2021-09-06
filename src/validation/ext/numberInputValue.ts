import { NumberInputValueTypeMeta, Type } from 'gigbook/json/types';
import NumberInputValue from 'gigbook/util/numberInputValue';
import { number, object, Schema, string } from 'gigbook/validation';

export const numberInputValue = (): Schema<
  NumberInputValueTypeMeta,
  NumberInputValue
> =>
  object({
    $type: number({ eq: Type.NumberInputValue as const }),
    value: string(),
  }).withTransform((obj) => NumberInputValue.fromText(obj.value));
