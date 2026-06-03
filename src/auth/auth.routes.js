import { Router } from "express";
import authController from "./auth.controller.js";
import { validate } from "../middlewares/validateData.middleware.js";
import { validateToken } from "../middlewares/validateToken.middleware.js";
import { register, login } from "./auth.scheme.js";

const router = Router();

router
    .post('/register', validate(register), authController.userRegister)
    .post('/login', validate(login), authController.userLogin)
    .post('/logout', authController.userLogout)
    .get('/protected', validateToken, authController.greetUser);

export default router;