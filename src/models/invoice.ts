import { durationString } from 'gigbook/util/validation';
import type { Asserts } from 'yup';
import * as yup from 'yup';

export const invoiceSchema = yup
  .object({
    id: yup.string().required(),
    date: yup.date().required(),
    me: yup
      .object({
        name: yup.string().required(),
        description: yup.string().required(),
        address: yup.string().required(),
      })
      .required(),
    client: yup
      .object({
        name: yup.string().required(),
        address: yup.string().required(),
        currency: yup.string().length(3).required(),
      })
      .required(),
    lineItems: yup
      .array(
        yup
          .object({
            project: yup.string().required(),
            task: yup.string().required(),
            rate: yup.number().positive().required(),
            duration: durationString.required(),
          })
          .required(),
      )
      .required(),
    billing: yup
      .object({
        increment: yup.number().positive().integer().required(),
        net: yup.number().positive().integer().required(),
        currency: yup.string().length(3).required(),
      })
      .required(),
    bank: yup
      .array(
        yup
          .object({
            key: yup.string().required(),
            value: yup.string().required(),
          })
          .required(),
      )
      .required(),
    template: yup.string().required(),
  })
  .required();

export type Invoice = Asserts<typeof invoiceSchema>;
