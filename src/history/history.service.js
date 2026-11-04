import Activity from '../models/mongo-models/Activity.js';
import { BadRequestError } from '../helpers/errors.js';
import { getOrSetCache } from '../helpers/cacheHelper.js';

class HistoryService {

    getProjectHistory = async (projectId, filters = {}) => {
        const query = { projectId: Number(projectId) };

        if (filters.entity) {
            query.entity = filters.entity;
        }

        if (filters.action) {
            query.action = filters.action.toUpperCase();
        }

        const limit = filters.limit ? Number(filters.limit) : 50;
        if (limit > 200) {
            throw new BadRequestError('El límite máximo de registros por consulta es 200');
        }

        const cacheKey = `history:proj:${projectId}:${filters.entity || 'all'}:${filters.action || 'all'}:${limit}`;

        return await getOrSetCache(cacheKey, 45, async () => {
            console.log('Query de historial a MongoDB:', query, 'Limit:', limit);
            const activities = await Activity.find(query)
                .sort({ createdAt: -1 })
                .limit(limit)
                .lean();

            return activities;
        });
    };

    getUserHistory = async (projectId, userId) => {
        const cacheKey = `history:proj:${projectId}:user:${userId}`;

        return await getOrSetCache(cacheKey, 60, async () => {
            const activities = await Activity.find({
                projectId: Number(projectId),
                userId: Number(userId)
            }, {
                _id: 0,
                __v: 0
            })
            .sort({ createdAt: 1 })
            .limit(100)
            .lean();

            return activities;
        });
    };
}

export default new HistoryService();
