import { ApiHandler } from 'gigbook/models/apiResponse';
import { sendError } from 'gigbook/util/apiResponse';
import { Schema } from 'jval';

export default function withBody<R, T, U>(
  schema: Schema<T, U>,
  next: (body: U) => ApiHandler<R>,
): ApiHandler<R> {
  return async (req, res) => {
    const body: unknown = req.body;
    if (schema.isType(body) && schema.isValid(body)) {
      return next(schema.map(body))(req, res);
    }
    sendError(res, 400, 'Invalid request body');
  };
}
