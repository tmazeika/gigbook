import { codec } from 'gigbook/json/codec';
import { ApiResponse } from 'gigbook/models/apiResponse';

export function sendJson<R>(res: ApiResponse<R>, value: R, code = 200): void {
  res.setHeader('Content-Type', 'application/json');
  res.status(code).send(codec.encode(value) as unknown as R);
}

export function sendCreated<R extends { id?: string | undefined }>(
  res: ApiResponse<R>,
  value: R,
  collectionLocation: string,
): void {
  if (value.id === undefined) {
    throw new Error('Expected ID to be present');
  }
  const location = `${collectionLocation}/${encodeURIComponent(value.id)}`;
  res.setHeader('Location', location);
  sendJson(res, value, 201);
}

export function sendVoid(res: ApiResponse, code = 204): void {
  res.status(code).end();
}

export function sendError<R>(
  res: ApiResponse<R>,
  code: number,
  message: string,
): void {
  res.status(code).json({ message });
}
