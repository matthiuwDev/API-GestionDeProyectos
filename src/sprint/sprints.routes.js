import { Router } from "express";
import sprintsController from "./sprints.controller.js";
import { validateToken } from "../middlewares/validateToken.middleware.js";
import { validate } from "../middlewares/validateData.middleware.js";
import { sprint } from "./sprint.scheme.js";

const router = Router();

router
    .get('/', validateToken, sprintsController.getSprints)
    .post('/', validateToken, validate(sprint), sprintsController.createSprint)
    .delete('/:id', validateToken, sprintsController.deleteSprint);

export default router;
