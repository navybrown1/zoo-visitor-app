import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../server/src/app';

/**
 * Vercel serverless entry — Express handles /api/* routes.
 * Wrap so Express receives the full path Vercel forwards.
 */
export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req as any, res as any);
}
