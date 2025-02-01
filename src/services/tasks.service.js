import { Task } from "../models/Task.js";

class TaskService{
    getTasks = async () => {
        try {
            const tasks = await Task.findAll();

            return tasks;
        } catch (error) {
            throw new Error("Error al obtener las tareas: " + error.message);
        }
    }

    getOneTask = async (id) => {
        try {
            const task = Task.findOne({
                where: {
                    id
                }
            });

            if(!task){
                throw new Error(`No se encontró la tarea con ID ${id}`);
            }

            return task;
        } catch (error) {
            throw new Error("Error al obtener la tarea: " + error.message);
        }
    }

    createTask = async (newTask) => {
        try {
            const createdTask = await Task.create(newTask);

            return createdTask
        } catch (error) {
            throw new Error("Error al crear la tarea: " + error.message);   
        }
    }

    updateTask = async (id, changes) => {
        try {
            const task = await Task.findByPk(id);

            if(!task){
                throw new Error(`No se encontró la tarea con ID ${id}`)
            }

            await task.update(changes);

            return task;
        } catch (error) {
            throw new Error(`Error al actualizar la tarea: ${error.message}`);
        }

    }

    deleteTask = async (id) => {
        try {
            await Task.destroy({
                where: {
                    id,
                }
            })
        } catch (error) {
            throw new Error("Error al eliminar la tarea: " + error.message);
        }
    }
}

export default new TaskService(); 