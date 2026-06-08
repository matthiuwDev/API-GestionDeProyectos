import { Router } from "express";
import tasksController from "./task.controller.js";
import { validate } from "../middlewares/validateData.middleware.js";
import { validateToken } from "../middlewares/validateToken.middleware.js";
import { task } from "./task.scheme.js";

const router = Router();

router
    .get('/', validateToken, tasksController.getTasks)
    .post('/', validateToken, validate(task), tasksController.createTask)
    .get('/:id', validateToken, tasksController.getOneTask)
    .put('/:id', validateToken, tasksController.updateTask)
    .delete('/:id', validateToken, tasksController.deleteTask);

export default router;