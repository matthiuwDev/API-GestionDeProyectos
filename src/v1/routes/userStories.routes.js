import { Router } from "express";
import userStoriesController from "../../controllers/userStories.controller.js";
const router = Router();
import { validate } from "../../middlewares/validateData.middleware.js";
import { userStory } from "../../schemes/userStory.scheme.js";

router
    .get('/', userStoriesController.getAllUserStories)
    .post('/', validate(userStory), userStoriesController.createUserStory)
    .get('/:id', userStoriesController.getOneUserStory)
    .delete('/:id', userStoriesController.deleteUserStory)
    .put('/:id', userStoriesController.updateUserStory)
export default router;
