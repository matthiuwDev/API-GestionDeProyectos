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
    const { projectId, status, startDate, endDate } = newSprintData;

    // Validar fechas (startDate <= endDate)
    if (new Date(startDate) > new Date(endDate)) {
      throw new Error("La fecha de inicio no puede ser posterior a la fecha de fin");
    }

    // Un solo ACTIVE por proyecto
    if (status === 'ACTIVE') {
      const activeSprint = await db.Sprint.findOne({
        where: { projectId, status: 'ACTIVE' }
      });

      if (activeSprint) {
        throw new Error("Ya existe un sprint activo en este proyecto");
      }
    }

    return await db.Sprint.create(newSprintData);
  };

  deleteSprint = async (id) => {
    const sprint = await db.Sprint.findByPk(id);

    if (!sprint) {
      throw new Error(`No se encontró el sprint con ID ${id}`);
    }

    // Regla 3: Impedir eliminar ACTIVE
    if (sprint.status === 'ACTIVE') {
      throw new Error("No se puede eliminar un sprint que está activo");
    }

    await sprint.destroy();
    return { message: "Sprint eliminado correctamente" };
  };
}

export default new SprintsService();
