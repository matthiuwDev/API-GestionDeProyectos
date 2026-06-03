import { Router } from "express";
import projectsController from "./projects.controller.js";
import { validateToken } from "../middlewares/validateToken.middleware.js";
import { verifyProjectOwner } from "../middlewares/verifyRole.middleware.js";
import { validate } from "../middlewares/validateData.middleware.js";
import { project } from "./project.scheme.js";

const router = Router();

router
    .get('/', validateToken, projectsController.getProjects)
    .post('/', validateToken, validate(project), projectsController.createProject)
    .get('/:id', validateToken, projectsController.getOneProject)
    .put('/:id', validateToken, verifyProjectOwner, projectsController.updateProject)
    .delete('/:id', validateToken, verifyProjectOwner, projectsController.deleteProject)
    .post('/:id/invite', validateToken, verifyProjectOwner, projectsController.inviteUserProject)
    .post('/invitations/accept', validateToken, projectsController.acceptInvitation)

export default router;