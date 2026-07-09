import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../server/src/app';

/**
 * Single serverless entry for all /api/* traffic (via vercel.json rewrite).
 */
export default function handler(req: VercelRequest, res: VercelResponse) {
  try {
    return app(req as any, res as any);
  } catch (err) {
    console.error('API handler error:', err);
    res.status(500).json({
      error: err instanceof Error ? err.message : 'Internal Server Error',
    });
  }
}
