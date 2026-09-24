import { Router } from "express";
import tasksController from "./task.controller.js";
import { validate } from "../middlewares/validateData.middleware.js";
import { validateToken } from "../middlewares/validateToken.middleware.js";
import { requireProjectRole } from "../middlewares/verifyRole.middleware.js";
import { task } from "./task.scheme.js";

const router = Router();

router
    .get('/', validateToken, requireProjectRole(['OWNER', 'GUEST']), tasksController.getTasks)
    .get('/:id', validateToken, requireProjectRole(['OWNER', 'GUEST']), tasksController.getOneTask)
    .post('/', validateToken, requireProjectRole(['OWNER', 'GUEST']), validate(task), tasksController.createTask)
    .put('/:id', validateToken, requireProjectRole(['OWNER', 'GUEST']), tasksController.updateTask)
    .delete('/:id', validateToken, requireProjectRole(['OWNER', 'GUEST']), tasksController.deleteTask);

export default router;