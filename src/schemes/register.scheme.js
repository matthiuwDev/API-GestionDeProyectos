import Joi from "joi";

//Register Scheme
export const register = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required()
        .messages({ "any.only": "Las contraseñas no coinciden" }),
    rolId: Joi.number().required()
});
