import { Router } from "express";
import projectsController from "../../controllers/projects.controller.js";
import { validate } from "../../middlewares/validateData.middleware.js";
import { project } from "../../schemes/project.scheme.js";

const router = Router();

router
    .get('/', projectsController.getProjects)
    .post('/', validate(project), projectsController.createProject)
    .get('/:id', projectsController.getOneProject)
    .put('/:id', projectsController.updateProject)
    .delete('/:id', projectsController.deleteProject);

export default router;