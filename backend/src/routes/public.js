/**
 * Route API publik — tidak perlu login.
 * Materi, video, kuis (baca + submit jawaban).
 */

import { Router } from 'express';
import { get as getSettings } from '../controllers/public/settingsController.js';
import { list as listSections, getById as getSectionById } from '../controllers/public/sectionController.js';
import { getById as getVideoById } from '../controllers/public/videoController.js';
import { getByVideoId as getQuizByVideoId, submit as submitQuiz } from '../controllers/public/quizController.js';

const router = Router();

router.get('/settings', getSettings);
router.get('/sections', listSections);
router.get('/sections/:id', getSectionById);
router.get('/videos/:id', getVideoById);
router.get('/videos/:id/quiz', getQuizByVideoId);
router.post('/videos/:id/quiz/submit', submitQuiz);

export default router;
