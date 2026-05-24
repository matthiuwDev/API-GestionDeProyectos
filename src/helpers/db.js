import { Router } from "express";
import db from "../database/database.js";

export const router = Router();

router.head("/sync", async function (req, res, next) {
  try {
    await db.sequelize.sync({ alter: true });
    return res.status(200).end();
  } catch (err) {
    console.error("Error al sincronizar la base de datos:", err);
    next(err);
  }
});

export default router;