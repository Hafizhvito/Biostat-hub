/**
 * Router utama API. Mount route publik (/) dan admin (/admin).
 * Health check: GET /api/health
 */

import { Router } from 'express';
import publicRoutes from './public.js';
import adminRoutes from './admin.js';

const router = Router();

router.use('/', publicRoutes);
router.use('/admin', adminRoutes);
router.get('/health', (req, res) => res.json({ status: 'ok' }));

export default router;