import { Router, Request, Response } from 'express';
import weather from '../data/weather.json';

const router = Router();

/** GET /api/weather — in-app weather / heat safety alert payload (F014) */
router.get('/', (_req: Request, res: Response) => {
  res.json({
    ...weather,
    updatedAt: new Date().toISOString(),
  });
});

export default router;
