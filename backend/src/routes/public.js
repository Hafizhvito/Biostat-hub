/**
 * Route API publik — tidak perlu login.
 * Materi, video, kuis (baca + submit jawaban).
 */

import { Router } from 'express';
import { get as getSettings } from '../controllers/public/settingsController.js';
import { list as listSections, getById as getSectionById } from '../controllers/public/sectionController.js';
import { getById as getVideoById } from '../controllers/public/videoController.js';
import {
  list as listQuizzes,
  getById as getQuizById,
  submit as submitQuiz,
} from '../controllers/public/quizController.js';

const router = Router();

router.get('/settings', getSettings);
router.get('/sections', listSections);
router.get('/sections/:id', getSectionById);
router.get('/quizzes', listQuizzes);
router.get('/quizzes/:id', getQuizById);
router.post('/quizzes/:id/submit', submitQuiz);
router.get('/videos/:id', getVideoById);

export default router;
