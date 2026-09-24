import { Router } from "express";
import projectsController from "./projects.controller.js";
import { validateToken } from "../middlewares/validateToken.middleware.js";
import { requireGlobalRole, requireProjectRole } from "../middlewares/verifyRole.middleware.js";
import { validate } from "../middlewares/validateData.middleware.js";
import { project } from "./project.scheme.js";

const router = Router();

router
    //Globales
    .get('/', validateToken, projectsController.getProjects)
    .post('/', validateToken, requireGlobalRole(['ADMIN']), validate(project), projectsController.createProject)
    .put('/:id', validateToken, requireGlobalRole(['ADMIN']), projectsController.updateProject)
    .delete('/:id', validateToken, requireGlobalRole(['ADMIN']), projectsController.deleteProject)
    
    //Nivel Proyecto
    .get('/:id', validateToken, requireProjectRole(['OWNER', 'GUEST']), projectsController.getOneProject)
    .get('/:id/users', validateToken, requireProjectRole(['OWNER']), projectsController.getProjectUsers)
    .post('/:id/invite', validateToken, requireProjectRole(['OWNER']), projectsController.inviteUserProject)
    
    .get('/invitations/validate/:token', projectsController.validateInvitation)
    .post('/invitations/accept', validateToken, projectsController.acceptInvitation)

export default router;