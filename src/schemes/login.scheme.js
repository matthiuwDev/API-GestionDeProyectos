import Joi from "joi";

//Login Scheme
export const login = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});