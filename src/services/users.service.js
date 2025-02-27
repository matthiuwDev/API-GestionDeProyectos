import { User } from "../models/User.js";

class UserService{
    getUsers = async () => {
        try {
            const users = await User.findAll();

            return users;
        } catch (error) {
            throw new Error("Error al obtener los usuarios: " + error.message);
        }
    }

    
}

export default new UserService();