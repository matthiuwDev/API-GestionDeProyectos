import { Router } from "express";
import projectsController from "../../controllers/projects.controller.js";
import { validateToken } from "../../middlewares/validateToken.middleware.js";
import { validate } from "../../middlewares/validateData.middleware.js";
import { project } from "../../schemes/project.scheme.js";

const router = Router();

router
    .get('/', validateToken, projectsController.getProjects)
    .post('/', validateToken, validate(project), projectsController.createProject)
    .get('/:id', validateToken, projectsController.getOneProject)
    .put('/:id', validateToken, projectsController.updateProject)
    .delete('/:id', validateToken, projectsController.deleteProject);

export default router;