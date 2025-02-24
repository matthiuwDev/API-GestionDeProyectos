import jwt from 'jsonwebtoken'
import { configDotenv } from 'dotenv'

configDotenv();

export const generateToken = (user) => {
    //Creamos un Objeto, el cual estará cifrado en el payload
    const userForToken = {
        id: user.id,
        email: user.email,
        rolId: user.rolId
    }

    //Firmamos el Token usando nuestra clave secreta y le damos un tiempo de expiración
    return jwt.sign(userForToken, process.env.SECRET_JWT_KEY, {
        expiresIn: '1h'
    })

}