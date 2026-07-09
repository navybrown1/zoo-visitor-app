import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

export type TicketStatus = 'valid' | 'used' | 'expired';

export interface Ticket {
  id: string;
  type: 'adult' | 'child' | 'senior' | 'family';
  visitorName: string;
  price: number;
  qrPayload: string;
  purchasedAt: string;
  status: TicketStatus;
}

/** In-memory ticket store for the Sprint 1 mock checkout / wallet flow (F001, F013). */
const tickets: Ticket[] = [];

const PRICES: Record<Ticket['type'], number> = {
  adult: 32,
  child: 22,
  senior: 26,
  family: 95,
};

const router = Router();

/** GET /api/tickets — list all issued digital passes */
router.get('/', (_req: Request, res: Response) => {
  res.json({ tickets });
});

/** POST /api/tickets — mock checkout; creates a digital pass with QR payload */
router.post('/', (req: Request, res: Response) => {
  const { type, visitorName } = req.body as {
    type?: Ticket['type'];
    visitorName?: string;
  };

  if (!type || !PRICES[type]) {
    res.status(400).json({ error: 'Invalid ticket type. Use adult|child|senior|family.' });
    return;
  }
  if (!visitorName || typeof visitorName !== 'string' || !visitorName.trim()) {
    res.status(400).json({ error: 'visitorName is required.' });
    return;
  }

  const id = uuidv4();
  const ticket: Ticket = {
    id,
    type,
    visitorName: visitorName.trim(),
    price: PRICES[type],
    // QR payload encodes ticket id for staff validation (F013)
    qrPayload: `ZOO-TICKET:${id}`,
    purchasedAt: new Date().toISOString(),
    status: 'valid',
  };

  tickets.push(ticket);
  res.status(201).json({ ticket, message: 'Mock payment successful. Digital pass added to wallet.' });
});

/** POST /api/tickets/validate — staff QR scan validation (F013) */
router.post('/validate', (req: Request, res: Response) => {
  const { qrPayload } = req.body as { qrPayload?: string };

  if (!qrPayload || typeof qrPayload !== 'string') {
    res.status(400).json({ valid: false, error: 'qrPayload is required.' });
    return;
  }

  const ticket = tickets.find((t) => t.qrPayload === qrPayload || t.id === qrPayload);
  if (!ticket) {
    res.status(404).json({ valid: false, error: 'Ticket not found.' });
    return;
  }

  if (ticket.status === 'used') {
    res.status(409).json({ valid: false, ticket, error: 'Ticket already used.' });
    return;
  }

  if (ticket.status === 'expired') {
    res.status(410).json({ valid: false, ticket, error: 'Ticket expired.' });
    return;
  }

  ticket.status = 'used';
  res.json({ valid: true, ticket, message: 'Entry granted. Ticket marked as used.' });
});

export default router;
