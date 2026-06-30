/**
 * Konfigurasi aplikasi Express: CORS, parser JSON, mount route /api, error handler.
 */

import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';
import routes from './routes/index.js';

const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());
app.use('/api', routes);
app.use(errorHandler);

export default app;