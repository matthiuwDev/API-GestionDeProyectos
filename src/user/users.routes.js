import { Router } from "express";
import userController from "./user.controller.js";
import { validateToken } from "../middlewares/validateToken.middleware.js";

const router = Router();

router
    .get('/', validateToken, userController.getUsers)

export default router;    