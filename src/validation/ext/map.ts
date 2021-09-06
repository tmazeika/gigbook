import { MapTypeMeta, Type } from 'gigbook/json/types';
import { array, number, object, Schema, unknown } from 'gigbook/validation';

export const map = (): Schema<MapTypeMeta, Map<unknown, unknown>> =>
  object({
    $type: number({ eq: Type.Map as const }),
    value: array(array(unknown(), { length: 2 as const })),
  }).withTransform((obj) => new Map(obj.value));
