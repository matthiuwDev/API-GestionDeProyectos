import { Router } from "express";
import tasksController from "../../controllers/task.controller.js";
import { validate } from "../../middlewares/validateData.middleware.js";
import { task } from "../../schemes/task.scheme.js";

const router = Router();

router
    .get('/', tasksController.getTasks)
    .post('/', validate(task), tasksController.createTask)
    .get('/:id', tasksController.getOneTask)
    .put('/:id', tasksController.updateTask)
    .delete('/:id', tasksController.deleteTask);

export default router;