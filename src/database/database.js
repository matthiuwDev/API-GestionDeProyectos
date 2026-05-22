import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import Sequelize from "sequelize";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    dialect: "postgres",
    logging: false,
  },
);

//Definición y sincronización de modelos
const db = {};
const modelsDir = path.join(__dirname, '../models');

const files = fs.readdirSync(modelsDir).filter((file) => {
  return file.indexOf('.') !== 0 && file.slice(-3) === '.js';
});

for (const file of files) {
  const filePath = path.join(modelsDir, file);
  
  const fileUrl = pathToFileURL(filePath).href; 
  
  const modelModule = await import(fileUrl);
  const defineModel = modelModule.default; 
  
  if (typeof defineModel === 'function') {
    const model = defineModel(sequelize);
    const modelName = file.slice(0, -3); 
    db[modelName] = model;
  }
}

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;