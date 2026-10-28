import Redis from 'ioredis';

let redisClient = null;

/**
 * Conexión a Redis usando ioredis.
 *
 * Configuración con patrón Fail-Safe:
 * - lazyConnect: true para controlar explícitamente cuándo conectar en el arranque de la app.
 * - enableOfflineQueue: false para que si Redis no está disponible, las operaciones de caché
 *   fallen de inmediato y la API recurra a PostgreSQL sin retrasar la petición HTTP.
 * - retryStrategy: límite de 3 reintentos para no sobrecargar el hilo de eventos.
 */
export const connectRedis = async () => {
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    console.warn('La capa de caché en memoria no estará disponible.');
    return null;
  }

  if (!redisClient) {
    redisClient = new Redis(redisUrl, {
      lazyConnect: true,
      enableOfflineQueue: false,
      maxRetriesPerRequest: 1,
      retryStrategy: (times) => {
        if (times > 3) {
          console.warn('Reintentos agotados. Operando temporalmente sin caché.');
          return null;
        }
        return Math.min(times * 300, 1500);
      }
    });

    redisClient.on('error', (err) => {
      console.warn('Advertencia en cliente Redis:', err.message);
    });
  }

  await redisClient.connect();
  console.log('Redis conectado correctamente');
  return redisClient;
};

export const getRedisClient = () => redisClient;

export default connectRedis;
