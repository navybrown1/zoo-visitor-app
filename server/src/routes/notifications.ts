import { Router, Request, Response } from 'express';
import { notifications } from '../data/notifications';

const router = Router();

/** In-memory copy so we can append mock broadcasts during a session (F006). */
const store = [...notifications];

/** GET /api/notifications — active safety broadcasts (lost child / emergency) */
router.get('/', (_req: Request, res: Response) => {
  res.json({
    notifications: store.filter((n) => n.active),
    polledAt: new Date().toISOString(),
  });
});

/** POST /api/notifications — inject a mock safety broadcast (prototype helper) */
router.post('/', (req: Request, res: Response) => {
  const { type, title, message } = req.body as {
    type?: 'lost_child' | 'emergency';
    title?: string;
    message?: string;
  };

  if (!type || !['lost_child', 'emergency'].includes(type)) {
    res.status(400).json({ error: 'type must be lost_child or emergency.' });
    return;
  }

  const notification = {
    id: `notif-${Date.now()}`,
    type,
    title: title ?? (type === 'lost_child' ? 'Lost Child Alert' : 'Emergency Alert'),
    message: message ?? 'Mock safety broadcast.',
    createdAt: new Date().toISOString(),
    active: true,
  };

  store.unshift(notification);
  res.status(201).json({ notification });
});

export default router;
