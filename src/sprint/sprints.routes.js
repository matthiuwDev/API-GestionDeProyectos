import { Router } from "express";
import sprintsController from "./sprints.controller.js";
import { validateToken } from "../middlewares/validateToken.middleware.js";
import { requireProjectRole } from "../middlewares/verifyRole.middleware.js";
import { validate } from "../middlewares/validateData.middleware.js";
import { sprint } from "./sprint.scheme.js";

const router = Router();

router
    .get('/', validateToken, requireProjectRole(['OWNER', 'GUEST']), sprintsController.getSprints)
    .get('/:id', validateToken, requireProjectRole(['OWNER', 'GUEST']), sprintsController.getSprintById)
    .post('/', validateToken, requireProjectRole(['OWNER']), validate(sprint), sprintsController.createSprint)
    .put('/:id', validateToken, requireProjectRole(['OWNER']), sprintsController.updateSprint)
    .delete('/:id', validateToken, requireProjectRole(['OWNER']), sprintsController.deleteSprint);

export default router;
