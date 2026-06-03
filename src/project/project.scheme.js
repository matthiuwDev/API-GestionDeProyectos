import Joi from "joi";

//Project Scheme
export const project = Joi.object({
    name: Joi.string().required(),
    priority: Joi.number().required(),
    description: Joi.string().optional()
});