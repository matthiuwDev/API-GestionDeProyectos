import Joi from "joi";

//UserStrty Scheme
export const userStory = Joi.object({
    name: Joi.string().required(),
    description: Joi.number().required(),
    projectId: Joi.number().required(),
});