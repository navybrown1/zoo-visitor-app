import express from 'express';
import cors from 'cors';
import ticketsRouter from './routes/tickets.js';
import parkingRouter from './routes/parking.js';
import notificationsRouter from './routes/notifications.js';
import weatherRouter from './routes/weather.js';
import mapRouter from './routes/map.js';

/** Shared Express app — used by local server and Vercel serverless. */
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'zoo-visitor-api', sprint: 1 });
});

app.use('/api/tickets', ticketsRouter);
app.use('/api/parking', parkingRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/weather', weatherRouter);
app.use('/api/map', mapRouter);

export default app;
