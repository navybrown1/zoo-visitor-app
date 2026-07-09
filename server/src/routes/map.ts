import { Router, Request, Response } from 'express';
import { exhibits } from '../data/exhibits';
import { services } from '../data/services';
import { routes } from '../data/routes';

const router = Router();

/** GET /api/map — exhibits, guest services, and visitor entrance (F002, F010) */
router.get('/', (_req: Request, res: Response) => {
  res.json({
    visitorEntrance: routes.visitorEntrance,
    exhibits,
    services,
  });
});

/** GET /api/map/services — guest services only (restroom / accessibility / family) */
router.get('/services', (req: Request, res: Response) => {
  const type = req.query.type as string | undefined;
  const filtered = type
    ? services.filter((s) => s.type === type)
    : services;
  res.json({ services: filtered });
});

/** GET /api/map/route/:exhibitId — mock routing polyline to an exhibit (F002) */
router.get('/route/:exhibitId', (req: Request, res: Response) => {
  const { exhibitId } = req.params;
  const path = (routes.routes as Record<string, { latitude: number; longitude: number }[]>)[exhibitId];

  if (!path) {
    res.status(404).json({ error: `No mock route for exhibit ${exhibitId}.` });
    return;
  }

  const exhibit = exhibits.find((e) => e.id === exhibitId);
  res.json({
    exhibitId,
    exhibitName: exhibit?.name ?? exhibitId,
    origin: routes.visitorEntrance,
    coordinates: path,
  });
});

export default router;
