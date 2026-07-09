import express from 'express';
import cors from 'cors';
import ticketsRouter from './routes/tickets';
import parkingRouter from './routes/parking';
import notificationsRouter from './routes/notifications';
import weatherRouter from './routes/weather';
import mapRouter from './routes/map';

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
