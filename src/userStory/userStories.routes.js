import { Router } from "express";
import userStoriesController from "./userStories.controller.js";
const router = Router();
import { validateToken } from "../middlewares/validateToken.middleware.js";
import { validate } from "../middlewares/validateData.middleware.js";
import { userStory } from "./userStory.scheme.js";

router
    .get('/', validateToken, userStoriesController.getAllUserStories)
    .post('/', validateToken, validate(userStory), userStoriesController.createUserStory)
    .get('/:id', validateToken, userStoriesController.getOneUserStory)
    .delete('/:id', validateToken, userStoriesController.deleteUserStory)
    .put('/:id', validateToken, userStoriesController.updateUserStory)
export default router;
