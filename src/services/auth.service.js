import { User } from "../models/User.js";

class UserService{

    createUser = async (newUser) => {
        try {
            const existingUser = await User.findOne({ where: { email: newUser.email } });

            if (existingUser) {
                throw new Error("Este usuario ya está registrado");
            }

            const createdUser = await User.create(newUser);

            return createdUser;

        } catch (error) {
            throw new Error("Error al crear el Usuario: " + error.message);
        }
    }

}

export default new UserService();