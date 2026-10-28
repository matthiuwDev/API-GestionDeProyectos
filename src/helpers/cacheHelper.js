import { getRedisClient } from '../database/redis.js';

/**
 * Obtiene un dato desde Redis o lo consulta en la base de datos si no está en caché.
 * Si el cliente de Redis no está disponible o falla la lectura, ejecuta el callback
 * directamente contra la base de datos para no interrumpir el servicio.
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
    } catch (error) {
        console.warn(`Error al leer la clave "${key}":`, error.message);
    }

    const freshData = await fetchFn();

    if (freshData !== null && freshData !== undefined) {
        try {
            await redis.set(key, JSON.stringify(freshData), 'EX', ttlSeconds);
        } catch (error) {
            console.warn(`Error al guardar en caché la clave "${key}":`, error.message);
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
export const invalidateCache = async (key) => {
    const redis = getRedisClient();
    if (!redis) return;

    try {
        await redis.del(key);
    } catch (error) {
        console.warn(`[Redis] Error al eliminar la clave "${key}":`, error.message);
    }
};

/**
 * Elimina todas las claves que coincidan con un patrón (ej. 'tasks:project:5:*').
 *
 * @param {string} pattern - Patrón con comodín para buscar las claves a limpiar.
 * @returns {Promise<void>}
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
        console.warn(`[Redis] Error al limpiar claves con el patrón "${pattern}":`, error.message);
    }
};

export default {
    getOrSetCache,
    invalidateCache,
    invalidateCacheByPattern
};