import app from "./app.js";
import db from "./database/database.js"; 
import connectMongoDB from "./database/mongodb.js";
import connectRedis from "./database/redis.js";

async function main(){
    try {
        await db.sequelize.authenticate();

        //Si falla Mongo o Redis solo mostramos un warning y la app sigue funcionando con PostgreSQL, pero sin historial ni caché.
        try {
            await connectMongoDB();
        } catch (mongoError) {
            console.error('No se pudo conectar a MongoDB:', mongoError.message);
            console.warn('El historial de actividades no estará disponible.');
        }

        try {
            await connectRedis();
        } catch (redisError) {
            console.error('No se pudo conectar a Redis:', redisError.message);
            console.warn('La capa de caché en memoria no estará disponible.');
        }

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Servidor escuchando en el puerto ${PORT}`);
        });
        
    } catch (error) {
        console.error('No se puede conectar a la base de datos:', error);
    }
}

main();
