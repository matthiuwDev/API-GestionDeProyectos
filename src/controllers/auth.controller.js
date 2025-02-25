import authService from "../services/auth.service.js";
import { generateToken } from "../helpers/tokenHelper.js";

class AuthController{
    userRegister = async (req, res, next) => {
        try {
            const { name, email, password, rolId } = req.body;
    
            const createdUser = await authService.createUser({ name, email, password, rolId });
    
            res.status(201).json({ status: "CREATED", data: createdUser });
    
        } catch (error) {
            //Captura errores lanzados desde el servicio y los envía al middleware de manejo de errores
            next(error);
        }
    };
    

    userLogin = async (req, res, next) => {   
        try {
            const { email, password } = req.body;

            const user = await authService.loginUser({ email, password });

            const token =  generateToken(user); 

            res
            .cookie('access_token', token, {
                httpOnly: true, //La cookie solo es accesible a través del servidor
                sameSite: 'strict' //La cookie solo es accesible en el mismo dominio
            }).status(200).json({ status: "OK", data: user, token })

        } catch (error) {
            next(error)
        }
    }
    
    greetUser = async (req, res, next) => {
        try {
            res.status(200).json({ status: "OK", message: "¡Saludos y Bienvenido!" });
        } catch (error) {
            next(error)
        }
    }
}

export default new AuthController();