import express from 'express';
import { isauthenticated } from '../Middleware/authMiddleware.js';
import { addProjectDetails } from '../controller/ProjectDetail.js';
import { storeUser } from '../controller/User.js';
import { generateQuestions } from '../controller/QuestionGeneration.js';
import { generateSummary, getAllProject } from '../controller/finalizeSummary.js';
import { generateFirstQuestions } from '../controller/firstQuestion.js';

const router = express.Router();

router.post('/users', isauthenticated, storeUser);
router.post('/project/details', isauthenticated, addProjectDetails);
router.post('/project/finalize',generateSummary);
router.post('/project/:id/questions', generateQuestions);
router.get('/project/:projectId/firstquestions', generateFirstQuestions);
router.get('/project/:userId/summary', getAllProject);


export default router;
