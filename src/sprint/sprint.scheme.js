import Joi from "joi";

export const sprint = Joi.object({
    projectId: Joi.number().required(),
    name: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().required(),
    goal: Joi.string().allow(null, '')
});
