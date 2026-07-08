import express from 'express';
import { isauthenticated } from '../Middleware/authMiddleware.js';
import { addProjectDetails } from '../controller/ProjectDetail.js';
import { storeUser } from '../controller/User.js';
import { processInterview } from '../controller/QuestionGeneration.js';
import { generateSummary, getAllProject } from '../controller/finalizeSummary.js';
import { startInterview } from '../controller/startInterview.js';
import { deleteProject } from '../controller/deleteProject.js';

const router = express.Router();

router.post('/users', isauthenticated, storeUser);

router.post('/project/details', isauthenticated, addProjectDetails);
router.post('/project/finalize', generateSummary);
router.post('/project/:id/processInterview', processInterview);
router.get('/project/:projectId/startInterview', startInterview);
router.get('/project/:userId/summary', getAllProject);

router.get('/delete/:projectId', deleteProject);


export default router;
