import historyService from './history.service.js';

class HistoryController {

    // GET /api/v1/history/projects/:projectId
    // Query params opcionales: entity, action, limit
    getProjectHistory = async (req, res, next) => {
        try {
            const { projectId } = req.params;
            const { entity, action, limit } = req.query;

            const history = await historyService.getProjectHistory(projectId, { entity, action, limit });
            res.status(200).json({ status: 'OK', data: history });
        } catch (error) {
            next(error);
        }
    };

    // GET /api/v1/history/projects/:projectId/users/:userId
    // Actividades de un usuario específico dentro del proyecto
    getUserHistory = async (req, res, next) => {
        try {
            const { projectId, userId } = req.params;

            const history = await historyService.getUserHistory(projectId, userId);
            res.status(200).json({ status: 'OK', data: history });
        } catch (error) {
            next(error);
        }
    };
}

export default new HistoryController();
