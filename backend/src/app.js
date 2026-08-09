/**
 * Konfigurasi aplikasi Express: CORS, parser JSON, mount route /api, error handler.
 */

import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import routes from './routes/index.js';
import { ensureUploadDirs } from './utils/upload.js';

const app = express();

const isDev = env.nodeEnv !== 'production';

app.use(helmet());
app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());
ensureUploadDirs();
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 1000 : 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Terlalu banyak percobaan login. Coba lagi dalam 15 menit.' },
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: isDev ? 1000 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Terlalu banyak permintaan. Coba lagi nanti.' },
});

app.use('/api', apiLimiter);
app.use('/api/admin/login', loginLimiter);

app.use('/api', routes);
app.use(errorHandler);

export default app;