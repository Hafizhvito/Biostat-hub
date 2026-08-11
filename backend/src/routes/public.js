/**
 * Route API publik — tidak perlu login.
 * Materi, video, kuis (baca + submit jawaban).
 */

import { Router } from 'express';
import { get as getSettings } from '../controllers/public/settingsController.js';
import { getCalculatorUrl } from '../controllers/admin/settingsController.js';
import { search } from '../controllers/public/searchController.js';
import { list as listSections, getById as getSectionById } from '../controllers/public/sectionController.js';
import { getById as getVideoById } from '../controllers/public/videoController.js';
import { list as listGlossary, getById as getGlossaryById } from '../controllers/public/glossaryController.js';
import { list as listDownloads, downloadFile } from '../controllers/public/downloadController.js';
import { list as listWizard } from '../controllers/public/wizardController.js';
import { list as listStatTests } from '../controllers/public/statTestController.js';
import { list as listCalculatorLinks } from '../controllers/public/calculatorLinkController.js';
import {
  list as listQuizzes,
  getById as getQuizById,
  submit as submitQuiz,
} from '../controllers/public/quizController.js';

const router = Router();

router.get('/settings', getSettings);
router.get('/settings/calculator-url', getCalculatorUrl);
router.get('/sections', listSections);
router.get('/sections/:id', getSectionById);
router.get('/quizzes', listQuizzes);
router.get('/quizzes/:id', getQuizById);
router.post('/quizzes/:id/submit', submitQuiz);
router.get('/videos/:id', getVideoById);
router.get('/search', search);
router.get('/glossary', listGlossary);
router.get('/glossary/:id', getGlossaryById);
router.get('/downloads', listDownloads);
router.get('/downloads/:id/file', downloadFile);
router.get('/wizard', listWizard);
router.get('/stat-tests', listStatTests);
router.get('/calculator-links', listCalculatorLinks);

export default router;
