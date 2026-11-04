import { getRedisClient } from '../database/redis.js';

/**
 * Recupera un valor desde Redis o ejecuta `fetchFn` para obtenerlo de la base de datos
 * y almacenarlo en caché (Cache-Aside). Si Redis no está disponible, delega la consulta
 * directamente a `fetchFn` sin interrumpir el flujo.
 *
 * @param {string} key - Clave de búsqueda en Redis (ej. 'tasks:15').
 * @param {number|Function} [ttlSeconds=120] - Tiempo de expiración en segundos, o el callback si se omite el TTL.
 * @param {Function} [fetchFn] - Función asíncrona que retorna los datos desde la BD en caso de no existir en caché.
 * @returns {Promise<any>} Datos obtenidos desde la caché o desde la base de datos.
 */
export const getOrSetCache = async (key, ttlSeconds = 120, fetchFn) => {
    //Permite llamar a la función omitiendo el TTL
    if (typeof ttlSeconds === 'function') {
        fetchFn = ttlSeconds;
        ttlSeconds = 120;
    }

    const redis = getRedisClient();

    if (!redis) {
        return await fetchFn();
    }

    try {
        const cached = await redis.get(key);
        if (cached !== null) {
            return JSON.parse(cached);
        }
    } catch (cacheError) {
        console.warn(`Error al leer clave "${key}":`, cacheError.message);
    }

    const freshData = await fetchFn();

    if (freshData !== null && freshData !== undefined) {
        try {
            await redis.set(key, JSON.stringify(freshData), 'EX', ttlSeconds);
        } catch (setError) {
            console.warn(`Error al escribir clave "${key}":`, setError.message);
        }
    }

    return freshData;
};

/**
 * Elimina una clave puntual de la caché.
 * Útil al actualizar o borrar un registro específico.
 *
 * @param {string} key - Clave exacta que se desea limpiar (ej. 'tasks:15').
 * @returns {Promise<void>}
 */
export const invalidateCache = async (...keys) => {
    const redis = getRedisClient();
    if (!redis || keys.length === 0) return;

    const flatKeys = keys.flat().filter(Boolean);
    if (flatKeys.length === 0) return;

    try {
        await redis.del(...flatKeys);
    } catch (error) {
        console.warn(`Error al invalidar claves [${flatKeys.join(', ')}]:`, error.message);
    }
};

/**
 * Invalida un grupo de claves que coincidan con un patrón determinado.
 * Utiliza scanStream para no bloquear el proceso de Redis
 *
 * Ejemplos:
 *   await invalidateCacheByPattern('tasks:userStory:*')
 *
 * @param {string} pattern - Patrón con comodín (ej: 'tasks:*')
 */
export const invalidateCacheByPattern = async (pattern) => {
    const redis = getRedisClient();
    if (!redis) return;

    try {
        const stream = redis.scanStream({ match: pattern, count: 100 });
        const keysToDelete = [];

        for await (const chunk of stream) {
            if (chunk.length > 0) {
                keysToDelete.push(...chunk);
            }
        }

        if (keysToDelete.length > 0) {
            await redis.del(...keysToDelete);
        }
    } catch (error) {
        console.warn(`Error al invalidar patrón "${pattern}" en Redis:`, error.message);
    }
};

export default {
    getOrSetCache,
    invalidateCache,
    invalidateCacheByPattern
};
