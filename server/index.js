import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import chatRouter from './routes/chat.js';
import requestsRouter from './routes/requests.js';
import locationsRouter from './routes/locations.js';

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.disable('x-powered-by');
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: '512kb' }));

app.get('/', (_req, res) => {
  res.json({ ok: true, service: 'shakti-api' });
});

app.use('/api', chatRouter);
app.use('/api', requestsRouter);
app.use('/api', locationsRouter);

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, _req, res, _next) => {
  void _next;
  const status = err.statusCode && Number.isInteger(err.statusCode) ? err.statusCode : 500;
  const message =
    status >= 500
      ? 'An unexpected error occurred. Please try again later.'
      : err.message || 'Request failed';

  if (status >= 500) {
    console.error('[shakti-api]', err);
  }

  res.status(status).json({ error: message });
});

app.listen(PORT, () => {
  console.log(`[shakti-api] listening on port ${PORT}`);
});
