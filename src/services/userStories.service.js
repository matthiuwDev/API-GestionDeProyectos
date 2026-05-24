// src/services/userStories.service.js
import db from "../database/database.js";

class UserStoriesService {
    
    getAllUserStories = async () => {
        return await db.UserStory.findAll();
    }

    getOneUserStory = async (id) => {
        const userStory = await db.UserStory.findByPk(id, {
            include: [db.Task]
        });
        
        if (!userStory) {
            throw new Error(`No se encontró la Historia de Usuario con ID ${id}`);
        }
        return userStory;
    }

    createUserStory = async (data) => {
        return await db.UserStory.create(data);
    }

    updateUserStory = async (id, changes) => {
        const userStory = await db.UserStory.findByPk(id);
        
        if (!userStory) {
            throw new Error(`No se puede actualizar: No se encontró la Historia de Usuario con ID ${id}`);
        }

        await userStory.update(changes); 
        
        return userStory; 
    }

    deleteUserStory = async (id) => {
        const deletedRows = await db.UserStory.destroy({
            where: { id }
        });

        if (deletedRows === 0) {
            throw new Error(`No se puede eliminar: No se encontró la Historia de Usuario con ID ${id}`);
        }

        return true;
    }
}

export default new UserStoriesService();