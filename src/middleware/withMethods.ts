import { NextApiHandler } from 'next';

export default function withMethods(
  methods: string[],
  next: NextApiHandler,
): NextApiHandler {
  return (req, res) => {
    if (req.method && methods.includes(req.method)) {
      return next(req, res);
    }
    res.setHeader('Allow', methods.join(', '));
    res.status(405).end();
  };
}
