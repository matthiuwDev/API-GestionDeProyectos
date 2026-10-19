import { Router } from 'express';
import historyController from './history.controller.js';
import { validateToken } from '../middlewares/validateToken.middleware.js';

const router = Router();

// Historial de todo el proyecto (filtrable por entity, action, limit)
// GET /api/v1/history/projects/:projectId?entity=Task&action=CREATE&limit=20
router.get('/projects/:projectId', validateToken, historyController.getProjectHistory);

// Historial de un usuario específico dentro de un proyecto
// GET /api/v1/history/projects/:projectId/users/:userId
router.get('/projects/:projectId/users/:userId', validateToken, historyController.getUserHistory);

export default router;
