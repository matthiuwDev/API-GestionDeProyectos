import db from "../database/database.js";
import bcrypt from 'bcryptjs';

class AuthService {

    createUser = async (newUser) => {
        const existingUser = await db.User.findOne({ where: { email: newUser.email } });

        if (existingUser) {
            throw new Error("Este usuario ya está registrado");
        }

        const createdUser = await db.User.create(newUser);

        return createdUser;
    }

    loginUser = async ({ email, password }) => {
        const user = await db.User.findOne({ where: { email } });

        console.log("USER", user);
        if (!user) {
            throw new Error("Usuario no encontrado");
        }

        const validPassword = await bcrypt.compare(password, user.password);
        console.log("validPassword", validPassword);

        if (!validPassword) {
            throw new Error("La contraseña es incorrecta");
        }

        return {
            id: user.id,
            email: user.email,
            role: user.role
        };
    }
}

export default new AuthService();