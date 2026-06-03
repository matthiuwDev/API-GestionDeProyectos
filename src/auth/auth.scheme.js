import Joi from "joi";

//Register Scheme
export const register = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required()
        .messages({ "any.only": "Las contraseñas no coinciden" }),
    inviteToken: Joi.string().optional()
});

//Login Scheme
export const login = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});
