// src/services/userStories.service.js
import db from "../database/database.js";
import { NotFoundError, BadRequestError } from "../helpers/errors.js";
import { sendAssignmentNotification } from "../helpers/notifications.js";
import { logActivity } from '../helpers/activityLogger.js';

class UserStoriesService {
    
    getAllUserStories = async (filters = {}) => {
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
    }

    getOneUserStory = async (id) => {
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
        await userStory.update(changes); 
        
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