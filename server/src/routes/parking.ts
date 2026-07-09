import { Router, Request, Response } from 'express';
import parking from '../data/parking.json';

const router = Router();

/** GET /api/parking — real-time (mock) parking lot capacities (F009) */
router.get('/', (_req: Request, res: Response) => {
  const lots = parking.lots.map((lot) => {
    const available = Math.max(0, lot.capacity - lot.occupied);
    const fillPercent = Math.round((lot.occupied / lot.capacity) * 100);
    return { ...lot, available, fillPercent };
  });

  res.json({
    lots,
    updatedAt: new Date().toISOString(),
  });
});

export default router;
