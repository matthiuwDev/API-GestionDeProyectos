import Activity from '../models/mongo-models/Activity.js';

export const logActivity = async ({ action, entity, entityId, projectId, userId, userName, snapshot = null, changes = null }) => {
    try {
        if (!action || !entity || !entityId || !projectId || !userId) {
            console.warn('No se pudo registrar actividad: Faltan datos obligatorios');
            return;
        }

        // Creamos el documento en MongoDB
        await Activity.create({
            action,
            entity,
            entityId,
            projectId,
            userId,
            userName,
            snapshot,
            changes
        });

        console.log(`Actividad registrada: ${userName} hizo ${action} en ${entity} ${entityId}`); 

    } catch (error) {
        console.error('Error guardando historial en MongoDB:', error.message);
    }
};