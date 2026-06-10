import projectsService from "./projects.service.js";

class ProjectsController {
    
    getProjects = async (req, res, next) => {
        try {
            const userId = req.user.id; 
            
            const projects = await projectsService.getProjects(userId);
            
            res.status(200).json({ status: 'OK', data: projects });
        } catch (error) {
            next(error);
        }
    }

    getOneProject = async (req, res, next) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;
            
            if (!id) {
                return res.status(400).json({ 
                    status: "FAILED", 
                    data: { error: "El parámetro ':id' no puede estar vacío" } 
                });
            }

            const project = await projectsService.getOneProject(id, userId);
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
                userId: req.user.id
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
            const userId = req.user.id;
            
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
            const userId = req.user.id;

            if (!id) {
                return res.status(400).json({ 
                    status: "FAILED", 
                    data: { error: "El parámetro ':id' no puede estar vacío" } 
                });
            }

            await projectsService.deleteProject(id, userId);

            res.sendStatus(204);
        } catch (error) {
            next(error);
        }
    }

    inviteUserProject = async (req, res, next) => {
        try {
            const { email } = req.body; 
            const { id: projectId } = req.params; 
            const inviter = req.user;

            if (!email) {
                return res.status(400).json({ status: "FAILED", message: "El email es requerido" });
            }

            await projectsService.inviteUserProject(email, projectId, inviter);

            res.status(200).json({ status: "OK", message: "Email de invitación enviado correctamente" });
        } catch (error) {
            next(error);
        }
    }

    acceptInvitation = async (req, res, next) => {
        try {
            const { token } = req.body;
            const invitedUserId = req.user.id; 

            await projectsService.acceptInvitation(token, invitedUserId);
            
            res.status(200).json({ status: "OK", message: "Invitación Aceptada" });
        } catch (error) {
            next(error);
        }
    }
}

export default new ProjectsController();