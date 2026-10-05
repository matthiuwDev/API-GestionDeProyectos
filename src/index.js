import app from "./app.js";
import db from "./database/database.js"; 
import connectMongoDB from "./database/mongodb.js";

async function main(){
    try {
        await db.sequelize.authenticate();

        try {
            await connectMongoDB();
        } catch (mongoError) {
            console.error('No se pudo conectar a MongoDB:', mongoError.message);
            console.warn('El historial de actividades no estará disponible.');
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