import db from '../database/database.js';

class SprintsService {
  getSprints = async (projectId, userId) => {
    // Verificar que el usuario pertenezca al proyecto
    const project = await db.Project.findByPk(projectId, {
      include: {
        model: db.User,
        where: { id: userId },
        through: { attributes: [] },
        required: true
      }
    });

    if (!project) {
      throw new Error(`No tienes acceso al proyecto con ID ${projectId}`);
    }

    return await db.Sprint.findAll({
      where: { projectId }
    });
  };

  createSprint = async (newSprintData) => {
    return await db.Sprint.create(newSprintData);
  };
}

export default new SprintsService();
