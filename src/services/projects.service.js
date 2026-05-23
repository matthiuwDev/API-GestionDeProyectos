import db from "../database/database.js";

class ProjectsService {

    getProjects = async () => {
        return await db.Project.findAll();
    }

    getOneProject = async (id) => {
        const project = await db.Project.findByPk(id, {
            include: {
                model: db.UserStory,
                include: [db.Task]
            }
        });
        
        if (!project) {
            throw new Error(`No se encontró el proyecto con ID ${id}`);
        }

        return project; 
    }

    createProject = async (newProject) => {
        return await db.Project.create(newProject); 
    }

    updateProject = async (id, changes) => {
        const project = await db.Project.findByPk(id);
        
        if (!project) {
            throw new Error(`No se puede actualizar: No se encontró el proyecto con ID ${id}`);
        }

        await project.update(changes); 
        return project; 
    };
    
    deleteProject = async (id) => {
        const deletedRows = await db.Project.destroy({
            where: { id }
        });

        if (deletedRows === 0) {
            throw new Error(`No se puede eliminar: No se encontró el proyecto con ID ${id}`);
        }

        return true;
    }
}

export default new ProjectsService();