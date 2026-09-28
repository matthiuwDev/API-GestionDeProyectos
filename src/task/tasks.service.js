import db from '../database/database.js';
import { NotFoundError, BadRequestError } from '../helpers/errors.js';

class TasksService {
  getTasks = async (filter = {}) => {
    const where = {};
    if (filter.userStoryId) {
      where.userStoryId = filter.userStoryId;
    }
    return await db.Task.findAll({ where });
  };

  getOneTask = async (id) => {
    const task = await db.Task.findByPk(id);

    if (!task) {
      throw new NotFoundError(`No se encontró la tarea con ID ${id}`);
    }
    return task;
  };

  // Validar que el usuario asignado sea miembro del proyecto de la HU
  _validateAssigneeMembership = async (assigneeId, userStoryId) => {
    const userStory = await db.UserStory.findByPk(userStoryId);
    if (!userStory) {
      throw new NotFoundError(`No se encontró la Historia de Usuario con ID ${userStoryId}`);
    }

    const isMember = await db.ProjectUsers.findOne({
      where: {
        userId: assigneeId,
        projectId: userStory.projectId
      }
    });

    if (!isMember) {
      throw new BadRequestError(
        `El usuario con ID ${assigneeId} no es miembro del proyecto`
      );
    }
  };

  createTask = async (newTask) => {
    if (newTask.assigneeId) {
      await this._validateAssigneeMembership(newTask.assigneeId, newTask.userStoryId);
    }
    return await db.Task.create(newTask);
  };

  updateTask = async (id, changes) => {
    const task = await db.Task.findByPk(id);

    if (!task) {
      throw new NotFoundError(`No se puede actualizar: No se encontró la tarea con ID ${id}`);
    }

    if (changes.assigneeId) {
      await this._validateAssigneeMembership(changes.assigneeId, task.userStoryId);
    }

    await task.update(changes);
    return task;
  };

  deleteTask = async (id) => {
    const deletedRows = await db.Task.destroy({
      where: { id }
    });

    if (deletedRows === 0) {
      throw new NotFoundError(`No se puede eliminar: No se encontró la tarea con ID ${id}`);
    }

    return true;
  };
}

export default new TasksService();
