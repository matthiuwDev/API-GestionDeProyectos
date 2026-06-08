import Joi from "joi";

//UserStrty Scheme
export const userStory = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow(null, ''),
    projectId: Joi.number().required(),
    sprintId: Joi.number().allow(null),
    position: Joi.number().allow(null)
});