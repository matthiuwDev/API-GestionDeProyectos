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

    createSprint = async (req, res, next) => {
        try {
            const { body } = req;
            const userId = req.user.id;

            // Verificar acceso al proyecto antes de crear el sprint
            // (El service ya lo hace en getSprints, pero aquí lo haremos implícitamente o el service debería validarlo)
            // Para seguir el patrón de Project, el controller prepara el objeto y el service lo crea.
            
            const sprintData = {
                ...body,
                projectId: body.projectId // Aseguramos que venga del body
            };

            const createdSprint = await sprintsService.createSprint(sprintData);
            res.status(201).json({ status: "CREATED", data: createdSprint });
        } catch (error) {
            next(error);
        }
    };
}

export default new SprintsController();
