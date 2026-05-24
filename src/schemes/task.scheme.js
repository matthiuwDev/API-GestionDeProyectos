import Joi from "joi";

export const task = Joi.object({
    name: Joi.string().required(),
    status: Joi.string().valid('TODO', 'IN_PROGRESS', 'DONE').optional(),
    userStoryId: Joi.number().required()
});