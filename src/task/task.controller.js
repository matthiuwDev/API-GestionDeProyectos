import tasksService from "./tasks.service.js";

class TasksController {
    
    getTasks = async (req, res, next) => {
        try {
            const { userStoryId } = req.query;
            const tasks = await tasksService.getTasks({ userStoryId });
            res.status(200).json({ status: 'OK', data: tasks });
        } catch (error) {
            next(error);
        }
    }

    getOneTask = async (req, res, next) => {
        try {
            const { id } = req.params;
            
            if (!id) {
                return res.status(400).json({ 
                    status: "FAILED", 
                    data: { error: "El parámetro ':id' no puede estar vacío" } 
                });
            }

            const task = await tasksService.getOneTask(id);
            res.status(200).json({ status: 'OK', data: task });
        } catch (error) {
            next(error);
        }
    }

    createTask = async (req, res, next) => {
        try {
            const { body, user } = req;
            
            const newTask = {
                name: body.name,
                status: body.status || 'TODO', 
                userStoryId: body.userStoryId,
                assigneeId: body.assigneeId,
            };

            const createdTask = await tasksService.createTask(newTask, user);
            res.status(201).json({ status: "CREATED", data: createdTask });
        } catch (error) {
            next(error);
        }
    }

    updateTask = async (req, res, next) => {
        try {
            const { body, params: { id }, user } = req;

            if (!id) {
                return res.status(400).json({ 
                    status: "FAILED", 
                    data: { error: "El parámetro ':id' no puede estar vacío" } 
                });
            }

            const updatedTask = await tasksService.updateTask(id, body, user);
            res.status(200).json({ status: "OK", data: updatedTask });
        } catch (error) {
            next(error);
        }
    }

    deleteTask = async (req, res, next) => {
        try {
            const { params: { id }, user } = req;

            if (!id) {
                return res.status(400).json({ 
                    status: "FAILED", 
                    data: { error: "El parámetro ':id' no puede estar vacío" } 
                });
            }

            await tasksService.deleteTask(id, user);
            res.sendStatus(204);
        } catch (error) {
            next(error);
        }
    }
}

export default new TasksController();