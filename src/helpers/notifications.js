import db from '../database/database.js';
import sendEmail from './sendEmail.js';
import config from '../config/config.js';

/**
 * Helper genérico para enviar notificaciones de asignación por correo electrónico.
 * @param {number} assigneeId - ID del usuario asignado
 * @param {string} assignerName - Nombre del usuario que realiza la asignación
 * @param {string} itemName - Título/Nombre del elemento asignado (HU o Tarea)
 * @param {string} itemType - Tipo de elemento ('Historia de Usuario' o 'Tarea')
 * @param {number} projectId - ID del proyecto al que pertenece el elemento
 */
export const sendAssignmentNotification = async (assigneeId, assignerName, itemName, itemType, projectId) => {
    try {
        const assignedUser = await db.User.findByPk(assigneeId, { attributes: ['name', 'email'] });
        const project = await db.Project.findByPk(projectId, { attributes: ['name'] });

        if (!assignedUser || !project) return;

        await sendEmail({
            to: assignedUser.email,
            subject: `Nueva asignación de ${itemType}`,
            template: 'assignmentTemplate', 
            data: {
                appName: 'Gestor de Proyectos',
                userName: assignedUser.name,
                assignerUser: assignerName,
                itemType: itemType,
                itemName: itemName,
                projectName: project.name,
                actionUrl: `${config.URL_WEB}/projects/${projectId}/active-sprint`,
            }
        });
    } catch (error) {
        console.error(`Error enviando correo de asignación de ${itemType}:`, error);
    }
};
