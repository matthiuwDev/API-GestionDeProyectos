// src/services/userStories.service.js
import db from "../database/database.js";
import { NotFoundError, BadRequestError } from "../helpers/errors.js";

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

    createUserStory = async (data) => {
        if (data.assigneeId) {
            await this._validateAssigneeMembership(data.assigneeId, data.projectId);
        }
        return await db.UserStory.create(data);
    }

    updateUserStory = async (id, changes) => {
        const userStory = await db.UserStory.findByPk(id);
        
        if (!userStory) {
            throw new NotFoundError(`No se puede actualizar: No se encontró la Historia de Usuario con ID ${id}`);
        }

        if (changes.assigneeId) {
            await this._validateAssigneeMembership(changes.assigneeId, userStory.projectId);
        }

        await userStory.update(changes); 
        
        return userStory; 
    }

    deleteUserStory = async (id) => {
        const deletedRows = await db.UserStory.destroy({
            where: { id }
        });

        if (deletedRows === 0) {
            throw new NotFoundError(`No se puede eliminar: No se encontró la Historia de Usuario con ID ${id}`);
        }

        return true;
    }
}

export default new UserStoriesService();