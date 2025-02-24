import jwt from 'jsonwebtoken'
import dotenv from 'dotenv';

dotenv.config();

//Middleware para validar el token en las rutas
export const validateToken = (req, res, next) => {
    const token = req.cookies.access_token;

    //Si el token no está en las cookies, lanzamos mensaje de error
    if (!token) {
        return res.status(401).json({ status: "FAILED", message: "No se encontró un token" });
    }

    try {
        //Decodificamos el Token, y el payload decodificado es asignado al req.user para que la información del usuario esté disponible para los siguientes middlewares
        const decodedToken = jwt.verify(token, process.env.SECRET_JWT_KEY);
        req.user = decodedToken;
        next();
    } catch (error) {
        //En caso de error, retornamos un mensaje 
        return res.status(401).json({ status: "FAILED", message: "Token inválido o ha expirado" });
    }
};
