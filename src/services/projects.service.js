import db from '../database/database.js';

class ProjectsService {
    getProjects = async (userId) => {
    return await db.Project.findAll({
        include: { 
            model: db.User, 
            attributes: ['id', 'name', 'email'],
            where: { id: userId }, 
            through: { 
                attributes: ['role', 'status'],
                where: { status: 'ACCEPTED' } 
            } 
        } 
    });
  };

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
  };

  createProject = async (newProject) => {
    const transaction = await db.sequelize.transaction();

    try {
      const project = await db.Project.create(newProject, { transaction });

      await project.addUser(newProject.userId, {
        through: { role: 'OWNER', status: 'ACCEPTED' },
        transaction
      });

      await transaction.commit();
      return project;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  updateProject = async (projectId, userId, changes) => {
    const project = await db.Project.findOne({
      where: { id: projectId, userId }
    });

    if (!project) {
      throw new Error(`Operación denegada o proyecto no encontrado`);
    }

    await project.update(changes);
    return project;
  };

  deleteProject = async (projectId, userId) => {
    const deletedRows = await db.Project.destroy({
      where: { id: projectId, userId }
    });

    if (deletedRows === 0) {
      throw new Error(`Operación denegada o proyecto no encontrado`);
    }
    return true;
  };
}

export default new ProjectsService();
