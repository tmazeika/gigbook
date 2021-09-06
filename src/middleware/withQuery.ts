import { ApiHandler } from 'gigbook/models/apiResponse';
import { sendError } from 'gigbook/util/apiResponse';

export default function withQuery<R, P>(
  params: (keyof P)[],
  next: (args: Record<keyof P, string>) => ApiHandler<R>,
): ApiHandler<R> {
  return (req, res) => {
    const args = Object.fromEntries(
      params.map((p) => [p, req.query[p as string]]),
    );
    if (Object.values(args).every((v) => typeof v === 'string')) {
      return next(args as Record<keyof P, string>)(req, res);
    }
    sendError(res, 400, 'Invalid query parameters');
  };
}
