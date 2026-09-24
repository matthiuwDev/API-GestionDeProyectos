import { Router } from "express";
import userStoriesController from "./userStories.controller.js";
import { validateToken } from "../middlewares/validateToken.middleware.js";
import { requireProjectRole, checkUserStoryUpdatePermissions } from "../middlewares/verifyRole.middleware.js";
import { validate } from "../middlewares/validateData.middleware.js";
import { userStory } from "./userStory.scheme.js";

const router = Router();

router
    .get('/', validateToken, requireProjectRole(['OWNER', 'GUEST']), userStoriesController.getAllUserStories)
    .get('/:id', validateToken, requireProjectRole(['OWNER', 'GUEST']), userStoriesController.getOneUserStory)
    .post('/', validateToken, requireProjectRole(['OWNER']), validate(userStory), userStoriesController.createUserStory)
    .delete('/:id', validateToken, requireProjectRole(['OWNER']), userStoriesController.deleteUserStory)
    .put('/:id', validateToken, requireProjectRole(['OWNER', 'GUEST']), checkUserStoryUpdatePermissions(), userStoriesController.updateUserStory)

export default router;
