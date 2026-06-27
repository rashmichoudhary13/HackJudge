import express from 'express';
import { isauthenticated } from '../Middleware/authMiddleware.js';
import { addProjectDetails } from '../controller/ProjectDetail.js';
import { storeUser } from '../controller/User.js';
import { generateQuestions } from '../controller/QuestionGeneration.js';

const router = express.Router();

router.post('/users', isauthenticated, storeUser);
router.post('/project/details', isauthenticated, addProjectDetails);
router.post('/project/:id/questions', generateQuestions);

export default router;
