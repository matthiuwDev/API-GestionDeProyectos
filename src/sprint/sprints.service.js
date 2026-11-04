import db from '../database/database.js';
import { NotFoundError, BadRequestError, ForbiddenError } from '../helpers/errors.js';
import { logActivity } from '../helpers/activityLogger.js';
import { getOrSetCache, invalidateCache, invalidateCacheByPattern } from '../helpers/cacheHelper.js';

class SprintsService {
  getSprints = async (projectId, userId) => {
    //alidar que el usuario pertenezca al proyecto 
    const project = await db.Project.findByPk(projectId, {
      include: {
        model: db.User,
        where: { id: userId },
        through: { attributes: [] },
        required: true
      }
    });

    if (!project) {
      throw new ForbiddenError(`No tienes acceso al proyecto con ID ${projectId}`);
    }

    const cacheKey = `sprints:project:${projectId}`;
    return await getOrSetCache(cacheKey, 120, async () => {
      return await db.Sprint.findAll({
        where: { projectId }
      });
    });
  };

  getSprintById = async (id, userId) => {
    const cacheKey = `sprints:${id}`;

    return await getOrSetCache(cacheKey, 120, async () => {
      const sprint = await db.Sprint.findByPk(id);
      if (!sprint) {
        throw new NotFoundError(`No se encontró el sprint con ID ${id}`);
      }
      return sprint;
    });
  }

  createSprint = async (newSprintData, currentUser) => {
    const { projectId, status, startDate, endDate } = newSprintData;

    const project = await db.Project.findByPk(projectId, {
      include: {
        model: db.User,
        where: { id: currentUser.id },
        through: { attributes: [] },
        required: true
      }
    });

    // Validar fechas (startDate <= endDate)
    if (new Date(startDate) > new Date(endDate)) {
      throw new BadRequestError("La fecha de inicio no puede ser posterior a la fecha de fin");
    }

    // Un solo ACTIVE por proyecto
    if (status === 'ACTIVE') {
      const activeSprint = await db.Sprint.findOne({
        where: { projectId, status: 'ACTIVE' }
      });

      if (activeSprint) {
        throw new BadRequestError("Ya existe un sprint activo en este proyecto");
      }
    }

    const createdSprint = await db.Sprint.create(newSprintData);

    //Invalidar caché de sprints del proyecto
    await invalidateCache(`sprints:project:${createdSprint.projectId}`);

    await logActivity({
      action: 'CREATE',
      entity: 'Sprint',
      entityId: createdSprint.id,
      projectId: createdSprint.projectId,
      userId: currentUser.id,
      userName: currentUser.name,
      snapshot: createdSprint.toJSON()
    });

    return createdSprint;
  };

  updateSprint = async (id, updatedSprintData, currentUser) => {
    const sprint = await db.Sprint.findByPk(id);

    if (!sprint) {
      throw new NotFoundError(`Sprint no encontrado`);
    }

    await sprint.update(updatedSprintData);

    //Invalidar caché del sprint, lista del proyecto y vistas de historias relacionadas
    await invalidateCache(
      `sprints:${sprint.id}`,
      `sprints:project:${sprint.projectId}`
    );
    await invalidateCacheByPattern(`userStories:proj:${sprint.projectId}:*`);

    await logActivity({
      action: 'UPDATE',
      entity: 'Sprint',
      entityId: sprint.id,
      projectId: sprint.projectId,
      userId: currentUser.id,
      userName: currentUser.name,
      changes: updatedSprintData
    });

    return sprint;
  }

  deleteSprint = async (id, currentUser) => {
    const sprint = await db.Sprint.findByPk(id);

    if (!sprint) {
      throw new NotFoundError(`No se encontró el sprint con ID ${id}`);
    }

    // Impedir eliminaci+on de sprints activos
    if (sprint.status === 'ACTIVE') {
      throw new BadRequestError("No se puede eliminar un sprint que está activo");
    }

    const projectId = sprint.projectId;
    await sprint.destroy();

    //Invalidar caché del sprint, lista del proyecto y vistas de historias relacionadas
    await invalidateCache(
      `sprints:${id}`,
      `sprints:project:${projectId}`
    );
    await invalidateCacheByPattern(`userStories:proj:${projectId}:*`);

    await logActivity({
      action: 'DELETE',
      entity: 'Sprint',
      entityId: id,
      projectId: projectId,
      userId: currentUser.id,
      userName: currentUser.name
    });

    return { message: "Sprint eliminado correctamente" };
  };
}

export default new SprintsService();
