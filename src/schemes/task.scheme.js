import Joi from "joi";

//Task Sheme
export const task = Joi.object({
    name: Joi.string().required(),
    done: Joi.string().optional,
    userStoryId: Joi.number().required()
})