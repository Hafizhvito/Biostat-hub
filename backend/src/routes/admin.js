/**
 * Route API admin. POST /login terbuka; sisanya dilindungi requireAdmin (JWT).
 */

import { Router } from 'express';
import { login } from '../controllers/admin/authController.js';
import { requireAdmin } from '../middleware/auth.js';
import { get as getSettings, update as updateSettings } from '../controllers/admin/settingsController.js';
import {
  list as listSections,
  create as createSection,
  update as updateSection,
  remove as removeSection,
  reorder as reorderSection,
} from '../controllers/admin/sectionController.js';
import {
  list as listVideos,
  create as createVideo,
  update as updateVideo,
  remove as removeVideo,
  reorder as reorderVideo,
} from '../controllers/admin/videoController.js';
import {
  getBySectionId as getQuizBySectionId,
  replaceBySectionId as replaceQuizBySectionId,
  removeBySectionId as removeQuizBySectionId,
} from '../controllers/admin/quizController.js';

const router = Router();

router.post('/login', login);
router.use(requireAdmin);

router.get('/settings', getSettings);
router.put('/settings', updateSettings);

router.get('/sections', listSections);
router.post('/sections', createSection);
router.put('/sections/:id', updateSection);
router.delete('/sections/:id', removeSection);
router.patch('/sections/:id/reorder', reorderSection);

router.get('/videos', listVideos);
router.post('/videos', createVideo);
router.put('/videos/:id', updateVideo);
router.delete('/videos/:id', removeVideo);
router.patch('/videos/:id/reorder', reorderVideo);

router.get('/sections/:sectionId/quiz', getQuizBySectionId);
router.put('/sections/:sectionId/quiz', replaceQuizBySectionId);
router.delete('/sections/:sectionId/quiz', removeQuizBySectionId);

export default router;
