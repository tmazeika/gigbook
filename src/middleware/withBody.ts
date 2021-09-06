import { ApiHandler } from 'gigbook/models/apiResponse';
import { sendError } from 'gigbook/util/apiResponse';
import { Schema } from 'gigbook/validation';

export default function withBody<R, T, U>(
  schema: Schema<T, U>,
  next: (body: U) => ApiHandler<R>,
): ApiHandler<R> {
  return async (req, res) => {
    const body: unknown = req.body;
    if (schema.isType(body)) {
      return next(schema.transform(body))(req, res);
    }
    sendError(res, 400, 'Invalid request body');
  };
}
