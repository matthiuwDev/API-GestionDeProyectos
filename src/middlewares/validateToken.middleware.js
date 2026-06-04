import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';

dotenv.config();

//Middleware para validar el token en las rutas
export const validateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ status: "FAILED", message: "No se encontró un token válido" });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET_JWT_KEY);
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(401).json({ status: "FAILED", message: "Token inválido o ha expirado" });
    }
};
