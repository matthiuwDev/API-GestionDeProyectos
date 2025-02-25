import Joi from "joi";

//Task Sheme
export const task = Joi.object({
    name: Joi.string().required(),
    projectId: Joi.number().required()
})