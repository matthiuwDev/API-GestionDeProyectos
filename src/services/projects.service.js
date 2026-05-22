import db from "../database/database.js";

class ProjectsService{

    getProjects = async() => {
        try {
            const projects = await db.Project.findAll();

            return projects;
        } catch (error) {
            throw new Error("Error al obtener los proyectos: " + error.message);
        }
    }

    getOneProject = async (id) => {
        try {
            const project = await db.Project.findOne({
                where: {
                    id
                }
            });
            
            if (!project) {
                throw new Error(`No se encontró el proyecto con ID ${id}`);
            }
    
            return project; 
            
        } catch (error) {
            throw new Error("Error al obtener el proyecto: " + error.message);
        }
    }

    createProject = async (newProject) => {
        try {
            const createdProject = await db.Project.create(newProject);
    
            return createdProject; 
        } catch (error) {
            throw new Error("Error al crear el proyecto: " + error.message);
        }
    }

    updateProject = async (id, changes) => {
        try {
            const project = await db.Project.findByPk(id);
            
            if (!project) {
                throw new Error(`No se encontró el proyecto con ID ${id}`);
            }
    
            await project.update(changes); 
    
            return project; 
        } catch (error) {
            throw new Error(`Error al actualizar el proyecto: ${error.message}`);
        }
    };
    

    deleteProject = async (id) => {
        try {
            await db.Project.destroy({
               where: {
                id,
               }
            })

            
        } catch (error) {
            throw new Error("Error al eliminar el proyecto: " + error.message);
        }
    }

    // getTasksByProject = async (id) => {
    //     try {
    //         const tasks = await db.Task.findAll({
    //             where: { projectId: id }
    //         });

    //         return tasks;
    //     } catch (error) {
    //         throw new Error("Error al obtener las tareas de un proyecto: " + error.message);
    //     }
    // }
}

export default new ProjectsService();
