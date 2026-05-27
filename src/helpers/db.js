import { Router } from "express";
import bcrypt from 'bcryptjs';
import db from "../database/database.js";

export const router = Router();

router.post("/sync", async function (req, res, next) {
  try {
    await db.sequelize.sync({ alter: true });
    console.log('Base de datos sincronizada');

    if (req.query.flag === 'CREATE_ADMINS') {
      const emailsEnv = process.env.ADMIN_EMAILS || '';
      const defaultPassword = process.env.ADMIN_PASSWORD ? process.env.ADMIN_PASSWORD.trim() : null;

      if (emailsEnv && defaultPassword) {
        const adminEmails = emailsEnv
          .split(',')
          .map((e) => e.trim())
          .filter(Boolean);

        console.info(`Procesando Admins... Encontrados: ${adminEmails.length}`);

        for (const email of adminEmails) {
          const userExists = await db.User.findOne({ where: { email } });

          if (!userExists) {
            console.info(`Creando Admin: ${email}`);
            
            await db.User.create({ 
              email,
              name: 'Usuario Admin',
              password: defaultPassword,
              role: 'ADMIN'
            });
            
            console.info(`SuperAdmin creado exitosamente: ${email}`);
          } else {
            console.info(`[SKIP] El usuario ya existe en BD: ${email}`);
          }
        }
      } else {
        console.warn('⚠️ No se encontraron las variables ADMIN_EMAILS o ADMIN_PASSWORD');
      }
    }

    return res.status(200).json({ 
      status: 'OK', 
      message: 'Operación de base de datos finalizada con éxito' 
    });

  } catch (error) {
    console.error("Error en el endpoint /sync:", error);
    next(error);
  }
});

export default router;