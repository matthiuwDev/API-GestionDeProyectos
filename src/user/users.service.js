import db from "../database/database.js";

class UserService {
    getUsers = async () => {
        return await db.User.findAll();
    }
}

export default new UserService();