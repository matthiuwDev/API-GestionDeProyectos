import authService from "../services/auth.service.js";
import { generateToken } from "../helpers/tokenHelper.js";

class AuthController {
    
    userRegister = async (req, res, next) => {
        try {
            const { name, email, password } = req.body;
    
            const createdUser = await authService.createUser({ name, email, password, rolId });
            res.status(201).json({ status: "CREATED", data: createdUser });
        } catch (error) {
            next(error);
        }
    };
    
    userLogin = async (req, res, next) => {   
        try {
            const { email, password } = req.body;

            const user = await authService.loginUser({ email, password });
            const token = generateToken(user); 

            res
                .cookie('access_token', token, {
                    httpOnly: true, 
                    sameSite: 'strict',
                    maxAge: 1000 * 60 * 60 * 24
                })
                .status(200)
                .json({ status: "OK", data: user, token });

        } catch (error) {
            next(error);
        }
    }

    userLogout = async (req, res, next) => {
        try {
            res
                .clearCookie('access_token')
                .status(200)
                .json({ status: "OK", message: "Sesión cerrada exitosamente" });
        } catch (error) {
            next(error);
        }
    }

    greetUser = async (req, res, next) => {
        try {
            res.status(200).json({ 
                status: "OK", 
                message: `¡Bienvenido de nuevo! Eres el usuario con ID: ${req.user.id}` 
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new AuthController();