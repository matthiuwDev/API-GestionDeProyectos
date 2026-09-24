import { Router } from "express";
import userController from "./user.controller.js";
import { validateToken } from "../middlewares/validateToken.middleware.js";
import { requireGlobalRole } from "../middlewares/verifyRole.middleware.js";

const router = Router();

router
    .get('/', validateToken, requireGlobalRole(['ADMIN']), userController.getUsers)

export default router;