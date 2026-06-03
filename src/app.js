//Configuración de Express
import express from 'express'
import cookieParser from 'cookie-parser'; 
import projectsRouter from './project/projects.routes.js';
import taskRouter from './task/tasks.routes.js'
import authRouter from './auth/auth.routes.js'
import userRouter from './user/users.routes.js'
import userStoriesRouter from './userStory/userStories.routes.js'
import dbRouter from './helpers/db.js';

import { errorHandler } from './middlewares/errorHandler.middleware.js';

const app = express();

//Middlewares
app.use(express.json());
app.use(cookieParser());

//API Sync DB
app.use('/db', dbRouter);

//Rutas
app.use("/api/v1/projects", projectsRouter)
app.use("/api/v1/tasks", taskRouter)
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/user-stories", userStoriesRouter)

app.use(errorHandler);


export default app;