import app from "./app.js";
import db from "./database/database.js"; 

async function main(){
    try {
        await db.sequelize.authenticate();

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is listening on port 🚀 ${PORT}`);
        });
        
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

main();