import db from "../database/database.js";
import { NotFoundError } from "../helpers/errors.js";

class TasksService {
    getTasks = async (filter = {}) => {
        const where = {};
        if (filter.userStoryId) {
            where.userStoryId = filter.userStoryId;
        }
        return await db.Task.findAll({ where });
    }

    getOneTask = async (id) => {
        const task = await db.Task.findByPk(id);

        if(!task){
            throw new NotFoundError(`No se encontró la tarea con ID ${id}`);
        }
        return task;
    }

    createTask = async (newTask) => {
        return await db.Task.create(newTask);
    }

    updateTask = async (id, changes) => {
        const task = await db.Task.findByPk(id);

        if(!task){
            throw new NotFoundError(`No se puede actualizar: No se encontró la tarea con ID ${id}`);
        }

        await task.update(changes);
        return task;
    }

    deleteTask = async (id) => {
        const deletedRows = await db.Task.destroy({
            where: { id }
        });

        if (deletedRows === 0) {
            throw new NotFoundError(`No se puede eliminar: No se encontró la tarea con ID ${id}`);
        }
        
        return true;
    }
}

export default new TasksService();