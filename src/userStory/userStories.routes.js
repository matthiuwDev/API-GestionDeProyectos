import { Router } from "express";
import userStoriesController from "./userStories.controller.js";
const router = Router();
import { validate } from "../middlewares/validateData.middleware.js";
import { userStory } from "./userStory.scheme.js";

router
    .get('/', userStoriesController.getAllUserStories)
    .post('/', validate(userStory), userStoriesController.createUserStory)
    .get('/:id', userStoriesController.getOneUserStory)
    .delete('/:id', userStoriesController.deleteUserStory)
    .put('/:id', userStoriesController.updateUserStory)
export default router;
