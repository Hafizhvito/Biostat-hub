/**
 * Route API admin. POST /login terbuka; sisanya dilindungi requireAdmin (JWT).
 */

import { Router } from 'express';
import { login } from '../controllers/admin/authController.js';
import { requireAdmin } from '../middleware/auth.js';
import { get as getSettings, getCalculatorUrl, update as updateSettings, updateCalculatorUrl } from '../controllers/admin/settingsController.js';
import {
  list as listSections,
  create as createSection,
  update as updateSection,
  remove as removeSection,
  reorder as reorderSection,
} from '../controllers/admin/sectionController.js';
import { list as listGlossary, create as createGlossary, update as updateGlossary, remove as removeGlossary } from '../controllers/admin/glossaryController.js';
import { list as listDownloads, create as createDownload, update as updateDownload, remove as removeDownload, uploadSingle as uploadDownload } from '../controllers/admin/downloadController.js';
import { list as listWizard, create as createWizard, update as updateWizard, remove as removeWizard, reorder as reorderWizard, uploadSingle as uploadWizard } from '../controllers/admin/wizardController.js';
import { list as listStatTests, create as createStatTest, update as updateStatTest, remove as removeStatTest, reorder as reorderStatTests, uploadSingle as uploadStatTest } from '../controllers/admin/statTestController.js';
import {
  list as listVideos,
  create as createVideo,
  update as updateVideo,
  remove as removeVideo,
  reorder as reorderVideo,
} from '../controllers/admin/videoController.js';
import {
  list as listQuizzes,
  getById as getQuizById,
  create as createQuiz,
  replaceById as replaceQuizById,
  removeById as removeQuizById,
} from '../controllers/admin/quizController.js';

const router = Router();

router.post('/login', login);
router.use(requireAdmin);

router.get('/settings', getSettings);
router.put('/settings', updateSettings);
router.get('/settings/calculator-url', getCalculatorUrl);
router.put('/settings/calculator-url', updateCalculatorUrl);

router.get('/sections', listSections);
router.post('/sections', createSection);
router.put('/sections/:id', updateSection);
router.delete('/sections/:id', removeSection);
router.patch('/sections/:id/reorder', reorderSection);

router.get('/glossary', listGlossary);
router.post('/glossary', createGlossary);
router.put('/glossary/:id', updateGlossary);
router.delete('/glossary/:id', removeGlossary);

router.get('/downloads', listDownloads);
router.post('/downloads', uploadDownload, createDownload);
router.put('/downloads/:id', updateDownload);
router.delete('/downloads/:id', removeDownload);

router.get('/wizard', listWizard);
router.post('/wizard', uploadWizard, createWizard);
router.put('/wizard/:id', uploadWizard, updateWizard);
router.put('/wizard/reorder', reorderWizard);
router.delete('/wizard/:id', removeWizard);

router.get('/stat-tests', listStatTests);
router.post('/stat-tests', uploadStatTest, createStatTest);
router.put('/stat-tests/:id', uploadStatTest, updateStatTest);
router.put('/stat-tests/reorder', reorderStatTests);
router.delete('/stat-tests/:id', removeStatTest);

router.get('/videos', listVideos);
router.post('/videos', createVideo);
router.put('/videos/:id', updateVideo);
router.delete('/videos/:id', removeVideo);
router.patch('/videos/:id/reorder', reorderVideo);

router.get('/quizzes', listQuizzes);
router.get('/quizzes/:id', getQuizById);
router.post('/quizzes', createQuiz);
router.put('/quizzes/:id', replaceQuizById);
router.delete('/quizzes/:id', removeQuizById);

export default router;
