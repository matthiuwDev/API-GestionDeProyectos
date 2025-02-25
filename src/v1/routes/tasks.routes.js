import { Router } from "express";
import taskController from "../../controllers/task.controller.js";
const router = Router();
import { validate } from "../../middlewares/validateData.middleware.js";
import { task } from "../../schemes/task.scheme.js";

router
    .get('/', taskController.getTasks)
    .post('/', validate(task), taskController.createTask)
    .put('/:id',taskController.updateTask)
    .delete('/:id', taskController.deleteTask)
    .get('/:id', taskController.getOneTask)

export default router;