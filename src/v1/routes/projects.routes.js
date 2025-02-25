import { Router } from "express";
import projectsController from "../../controllers/projects.controller.js";
const router = Router();
import { validate } from "../../middlewares/validateData.middleware.js";
import { project } from "../../schemes/project.scheme.js";

router
    .get('/', projectsController.getProjects)
    .post('/', validate(project), projectsController.createProject)
    .put('/:id', projectsController.updateProject)
    .delete('/:id', projectsController.deleteProject)
    .get('/:id', projectsController.getOneProject)
    .get('/:id/tasks', projectsController.getTasksByProject)
export default router;
