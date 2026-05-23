import projectsService from "../services/projects.service.js";

class ProjectsController {
    
    getProjects = async (req, res, next) => {
        try {
            const projects = await projectsService.getProjects();
            res.status(200).json({ status: 'OK', data: projects });
        } catch (error) {
            next(error);
        }
    }

    getOneProject = async (req, res, next) => {
        try {
            const { id } = req.params;
            
            if (!id) {
                return res.status(400).json({ 
                    status: "FAILED", 
                    data: { error: "El parámetro ':id' no puede estar vacío" } 
                });
            }

            const project = await projectsService.getOneProject(id);
            res.status(200).json({ status: 'OK', data: project });
        } catch (error) {
            next(error);
        }
    }
    
    createProject = async (req, res, next) => {
        try {
            const { body } = req;

            const newProject = {
                name: body.name,
                priority: body.priority,
                description: body.description,
            };

            const createdProject = await projectsService.createProject(newProject);
            res.status(201).json({ status: "CREATED", data: createdProject });
        } catch (error) {
            next(error); 
        }
    };

    updateProject = async (req, res, next) => {
        try {
            const { body, params: { id } } = req;  
            
            if (!id) {
                return res.status(400).json({ 
                    status: "FAILED", 
                    data: { error: "El parámetro ':id' no puede estar vacío" } 
                });
            }
    
            const updatedProject = await projectsService.updateProject(id, body); 
            res.status(200).json({ status: "OK", data: updatedProject });
        } catch (error) {
            next(error);
        }
    };

    deleteProject = async (req, res, next) => {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({ 
                    status: "FAILED", 
                    data: { error: "El parámetro ':id' no puede estar vacío" } 
                });
            }

            await projectsService.deleteProject(id);

            res.sendStatus(204);
        } catch (error) {
            next(error);
        }
    }
}

export default new ProjectsController();