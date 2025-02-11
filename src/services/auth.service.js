import { User } from "../models/User.js";
import bcrypt from "bcrypt"

class UserService{

    createUser = async (newUser) => {
        try {
            const existingUser = await User.findOne({ where: { email: newUser.email } });

            if (existingUser) throw new Error("Este usuario ya está registrado");

            const createdUser = await User.create(newUser);

            return createdUser;

        } catch (error) {
            throw new Error("Error al crear el Usuario: " + error.message);
        }
    }

    loginUser = async ({ email, password }) => {
        try {
            const user = await User.findOne({ where: { email: email } })

            if (!user) throw new Error("Usuario no encontrado");

            const validPassword = bcrypt.compareSync(password, user.password);

            if(!validPassword) throw new Error("La contraseña es incorrecta")

            return {
                email: user.email
            };
        } catch (error) {
            throw new Error("Error en el login: " + error.message);
        }
    }

}

export default new UserService();