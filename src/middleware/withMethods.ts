import { ApiHandler } from 'gigbook/models/apiResponse';
import { sendError } from 'gigbook/util/apiResponse';

const httpMethods = ['DELETE', 'GET', 'PATCH', 'POST', 'PUT'] as const;

type HttpMethod = typeof httpMethods[number];

type Handlers = Partial<Record<HttpMethod, ApiHandler<any>>>;

export default function withMethods(handlers: Handlers): ApiHandler<unknown> {
  return (req, res) => {
    const next = handlers[req.method as HttpMethod];
    if (next) {
      return next(req, res);
    }
    res.setHeader('Allow', Object.keys(handlers).join(', '));
    sendError(res, 405, 'Method not allowed');
  };
}
