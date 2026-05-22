import db from "../database/database.js";

class UserService{
    getUsers = async () => {
        try {
            const users = await db.User.findAll();

            return users;
        } catch (error) {
            throw new Error("Error al obtener los usuarios: " + error.message);
        }
    }

    
}

export default new UserService();