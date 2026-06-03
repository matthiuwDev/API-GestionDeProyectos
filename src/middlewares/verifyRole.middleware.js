import db from "../database/database.js";

export const verifyProjectOwner = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const projectId = req.params.id;

        const projectUser = await db.sequelize.models.projects_users.findOne({
            where: {
                userId: userId,
                projectId: projectId
            }
        });

        if (!projectUser) {
            return res.status(404).json({ status: 'FAILED', message: 'Proyecto no encontrado o no tienes acceso.' });
        }

        if (projectUser.role !== 'OWNER') {
            return res.status(403).json({ status: 'FAILED', message: 'Acceso denegado: Solo el creador del proyecto puede realizar esta acción.' });
        }

        next();

    } catch (error) {
        next(error);
    }
};