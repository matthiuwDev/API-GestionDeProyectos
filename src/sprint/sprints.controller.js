import sprintsService from "./sprints.service.js";

class SprintsController {
    getSprints = async (req, res, next) => {
        try {
            const { projectId } = req.query;
            const userId = req.user.id;

            if (!projectId) {
                return res.status(400).json({ 
                    status: "FAILED", 
                    data: { error: "El parámetro query 'projectId' es requerido" } 
                });
            }

            const sprints = await sprintsService.getSprints(projectId, userId);
            res.status(200).json({ status: 'OK', data: sprints });
        } catch (error) {
            next(error);
        }
    }

    getSprintById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const sprint = await sprintsService.getSprintById(id, userId);
            res.status(200).json({ status: 'OK', data: sprint });
        } catch (error) {
            next(error);
        }
    }

    createSprint = async (req, res, next) => {
        try {
            const { body } = req;
            const currentUser = req.user;

            const sprintData = {
                ...body,
                projectId: body.projectId 
            };

            const createdSprint = await sprintsService.createSprint(sprintData, currentUser);
            res.status(201).json({ status: "CREATED", data: createdSprint });
        } catch (error) {
            next(error);
        }
    };

    updateSprint = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { body } = req;
            const currentUser = req.user;

            const updatedSprint = await sprintsService.updateSprint(id, body, currentUser);
            res.status(200).json({ status: "OK", data: updatedSprint });
        } catch (error) {
            next(error);
        }
    };

    deleteSprint = async (req, res, next) => {
        try {
            const { id } = req.params;
            const currentUser = req.user;

            const result = await sprintsService.deleteSprint(id, currentUser);
            res.status(200).json({ status: "OK", data: result });
        } catch (error) {
            next(error);
        }
    };
}

export default new SprintsController();
