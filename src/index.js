import app from "./app.js";
import { sequelize } from "./database/database.js"
import { User } from "./models/User.js";

async function main(){
    try {
        //Prueba de Conexión
        // await sequelize.authenticate();
        // console.log('Connection has been established successfully 🛜');

        //Sincronización
        await sequelize.sync({ alter: true })

        app.listen(3000)
        console.log('Server is listening on port 🚀', 3000);
        
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

main();

