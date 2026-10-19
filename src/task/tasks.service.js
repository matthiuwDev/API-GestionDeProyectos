import db from '../database/database.js';
import { NotFoundError, BadRequestError } from '../helpers/errors.js';
import { sendAssignmentNotification } from '../helpers/notifications.js';
import { logActivity } from '../helpers/activityLogger.js';

class TasksService {
  getTasks = async (filter = {}) => {
    const where = {};
    if (filter.userStoryId) {
      where.userStoryId = filter.userStoryId;
    }
    return await db.Task.findAll({ 
      where,
      include: [{ model: db.User, as: 'assignee', attributes: ['id', 'name', 'email'] }]
    });
  };

  getOneTask = async (id) => {
    const task = await db.Task.findByPk(id, {
      include: [{ model: db.User, as: 'assignee', attributes: ['id', 'name', 'email'] }]
    });

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

  createTask = async (newTask, currentUser) => {
    if (newTask.assigneeId) {
      await this._validateAssigneeMembership(newTask.assigneeId, newTask.userStoryId);
    }
    
    const createdTask = await db.Task.create(newTask);
    const userStory = await db.UserStory.findByPk(newTask.userStoryId);

    if (newTask.assigneeId && currentUser) {
      await sendAssignmentNotification(
        newTask.assigneeId,
        currentUser.name,
        newTask.name,
        'Tarea',
        userStory.projectId
      );
    }
    console.log('Tareita:', createdTask.toJSON());

    // Registro de actividad en MongoDB
    await logActivity({
      action: 'CREATE',
      entity: 'Task',
      entityId: createdTask.id,
      projectId: userStory.projectId,
      userId: currentUser.id,
      userName: currentUser.name,
      snapshot: createdTask.toJSON()
    });

    return createdTask;
  };

  updateTask = async (id, changes, currentUser) => {
    const task = await db.Task.findByPk(id);

    if (!task) {
      throw new NotFoundError(`No se puede actualizar: No se encontró la tarea con ID ${id}`);
    }

    if (changes.assigneeId && changes.assigneeId !== task.assigneeId) {
      await this._validateAssigneeMembership(changes.assigneeId, task.userStoryId);
    }

    const oldAssigneeId = task.assigneeId;
    await task.update(changes);

    const userStory = await db.UserStory.findByPk(task.userStoryId);
    if (changes.assigneeId && changes.assigneeId !== oldAssigneeId && currentUser) {
      await sendAssignmentNotification(
        changes.assigneeId,
        currentUser.name,
        task.name,
        'Tarea',
        userStory.projectId
      );
    }

    await logActivity({
      action: 'UPDATE',
      entity: 'Task',
      entityId: task.id,
      projectId: userStory.projectId,
      userId: currentUser.id,
      userName: currentUser.name,
      changes: changes,
    });

    return task;
  };

  deleteTask = async (id, currentUser) => {
    const task = await db.Task.findByPk(id);

    if (!task) {
      throw new NotFoundError(`No se puede eliminar: No se encontró la tarea con ID ${id}`);
    }

    const userStory = await db.UserStory.findByPk(task.userStoryId);

    await task.destroy();

    await logActivity({
      action: 'DELETE',
      entity: 'Task',
      entityId: task.id,
      projectId: userStory.projectId,
      userId: currentUser.id,
      userName: currentUser.name,
    });

    return true;
  };
}

export default new TasksService();
