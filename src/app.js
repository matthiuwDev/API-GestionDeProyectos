//Configuración de Express
import express from 'express'
import cookieParser from 'cookie-parser'; 
import v1ProjectsRouter from './v1/routes/projects.routes.js';
import v1TaskRouter from './v1/routes/tasks.routes.js'
import v1AuthRouter from './v1/routes/auth.routes.js'
import v1UserRouter from './v1/routes/users.routes.js'

import { errorHandler } from './middlewares/errorHandler.middleware.js';

const app = express();

//Middlewares
app.use(express.json());
app.use(cookieParser());


//Rutas
app.use("/api/v1/projects", v1ProjectsRouter)
app.use("/api/v1/tasks", v1TaskRouter)
app.use("/api/v1/auth", v1AuthRouter)
app.use("/api/v1/users", v1UserRouter)

app.use(errorHandler);


export default app;