import db from "../database/database.js";

class TasksService {
    getTasks = async () => {
        return await db.Task.findAll();
    }

    getOneTask = async (id) => {
        const task = await db.Task.findByPk(id);

        if(!task){
            throw new Error(`No se encontró la tarea con ID ${id}`);
        }
        return task;
    }

    createTask = async (newTask) => {
        return await db.Task.create(newTask);
    }

    updateTask = async (id, changes) => {
        const task = await db.Task.findByPk(id);

        if(!task){
            throw new Error(`No se puede actualizar: No se encontró la tarea con ID ${id}`);
        }

        await task.update(changes);
        return task;
    }

    deleteTask = async (id) => {
        const deletedRows = await db.Task.destroy({
            where: { id }
        });

        if (deletedRows === 0) {
            throw new Error(`No se puede eliminar: No se encontró la tarea con ID ${id}`);
        }
        
        return true;
    }
}

export default new TasksService();