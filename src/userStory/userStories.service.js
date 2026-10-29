// src/services/userStories.service.js
import db from "../database/database.js";
import { NotFoundError, BadRequestError } from "../helpers/errors.js";
import { sendAssignmentNotification } from "../helpers/notifications.js";
import { logActivity } from '../helpers/activityLogger.js';
import { getOrSetCache, invalidateCache, invalidateCacheByPattern } from '../helpers/cacheHelper.js';

class UserStoriesService {
    
    getAllUserStories = async (filters = {}) => {
        const proj = filters.projectId || 'all';
        const sprint = filters.sprintId !== undefined ? filters.sprintId : 'any';
        const tasks = (filters.includeTasks === 'true' || filters.includeTasks === true) ? 'withTasks' : 'noTasks';
        const cacheKey = `userStories:proj:${proj}:sprint:${sprint}:${tasks}`;

        return await getOrSetCache(cacheKey, 120, async () => {
            const where = {};
            const queryOptions = { where };
            
            if (filters.projectId) {
                where.projectId = filters.projectId;
            }

            if (filters.sprintId !== undefined) {
                // Manejar el caso de 'null' como string proveniente de query params
                where.sprintId = filters.sprintId === 'null' ? null : filters.sprintId;
            }

            if (filters.includeTasks === 'true' || filters.includeTasks === true) {
                queryOptions.include = [
                    { model: db.Task, include: [{ model: db.User, as: 'assignee', attributes: ['id', 'name', 'email'] }] },
                    { model: db.User, as: 'assignee', attributes: ['id', 'name', 'email'] }
                ];
            } else {
                queryOptions.include = [{ model: db.User, as: 'assignee', attributes: ['id', 'name', 'email'] }];
            }

            return await db.UserStory.findAll(queryOptions);
        });
    }

    getOneUserStory = async (id) => {
        const cacheKey = `userStories:${id}`;

        return await getOrSetCache(cacheKey, 120, async () => {
            const userStory = await db.UserStory.findByPk(id, {
                include: [
                    { model: db.Task, include: [{ model: db.User, as: 'assignee', attributes: ['id', 'name', 'email'] }] },
                    { model: db.User, as: 'assignee', attributes: ['id', 'name', 'email'] }
                ]
            });
            
            if (!userStory) {
                throw new NotFoundError(`No se encontró la Historia de Usuario con ID ${id}`);
            }
            return userStory;
        });
    }

    _validateAssigneeMembership = async (assigneeId, projectId) => {
        const isMember = await db.ProjectUsers.findOne({
            where: {
                userId: assigneeId,
                projectId
            }
        });

        if (!isMember) {
            throw new BadRequestError(
                `El usuario con ID ${assigneeId} no es miembro del proyecto`
            );
        }
    }

    createUserStory = async (data, currentUser) => {
        if (data.assigneeId) {
            await this._validateAssigneeMembership(data.assigneeId, data.projectId);
        }
        
        const newUserStory = await db.UserStory.create(data);

        // Invalidar caché: todas las vistas del proyecto (backlog, sprints, con/sin tareas)
        await invalidateCacheByPattern(`userStories:proj:${newUserStory.projectId}:*`);

        if (data.assigneeId) {
            await sendAssignmentNotification(
                data.assigneeId, 
                currentUser.name, 
                data.name, 
                'Historia de Usuario', 
                data.projectId
            );
        }

        await logActivity({
            action: 'CREATE',
            entity: 'UserStory',
            entityId: newUserStory.id,
            projectId: newUserStory.projectId,
            userId: currentUser.id,
            userName: currentUser.name,
            snapshot: newUserStory.toJSON()
        });

        return newUserStory;
    }

    updateUserStory = async (id, changes, currentUser) => {
        const userStory = await db.UserStory.findByPk(id);
        
        if (!userStory) {
            throw new NotFoundError(`No se puede actualizar: No se encontró la Historia de Usuario con ID ${id}`);
        }

        if (changes.assigneeId && changes.assigneeId !== userStory.assigneeId) {
            await this._validateAssigneeMembership(changes.assigneeId, userStory.projectId);
        }

        const oldAssigneeId = userStory.assigneeId;
        const oldProjectId = userStory.projectId;
        await userStory.update(changes); 

        // Invalidar caché: la HU individual y todas las vistas del proyecto
        await invalidateCache(`userStories:${userStory.id}`);
        await invalidateCacheByPattern(`userStories:proj:${userStory.projectId}:*`);
        if (changes.projectId && changes.projectId !== oldProjectId) {
            await invalidateCacheByPattern(`userStories:proj:${changes.projectId}:*`);
        }
        
        if (changes.assigneeId && changes.assigneeId !== oldAssigneeId) {
            await sendAssignmentNotification(
                changes.assigneeId,
                currentUser.name,
                userStory.name,
                'Historia de Usuario',
                userStory.projectId
            );
        }

        await logActivity({
            action: 'UPDATE',
            entity: 'UserStory',
            entityId: userStory.id,
            projectId: userStory.projectId,
            userId: currentUser.id,
            userName: currentUser.name,
            changes: changes
        });

        return userStory; 
    }

    deleteUserStory = async (id, currentUser) => {
        const userStory = await db.UserStory.findByPk(id);

        if (!userStory) {
            throw new NotFoundError(`No se puede eliminar: No se encontró la Historia de Usuario con ID ${id}`);
        }

        const projectId = userStory.projectId;
        await userStory.destroy();

        // Invalidar caché: la HU individual y todas las vistas del proyecto
        await invalidateCache(`userStories:${id}`);
        await invalidateCacheByPattern(`userStories:proj:${projectId}:*`);

        await logActivity({
            action: 'DELETE',
            entity: 'UserStory',
            entityId: id,
            projectId: projectId,
            userId: currentUser.id,
            userName: currentUser.name
        });

        return true;
    }
}

export default new UserStoriesService();
