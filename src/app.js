//Configuración de Express
import express from 'express'
import cookieParser from 'cookie-parser'; 
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';

import projectsRouter from './project/projects.routes.js';
import taskRouter from './task/tasks.routes.js';
import authRouter from './auth/auth.routes.js';
import userRouter from './user/users.routes.js';
import userStoriesRouter from './userStory/userStories.routes.js';
import dbRouter from './helpers/db.js';

import { errorHandler } from './middlewares/errorHandler.middleware.js';

const app = express();

app.disable('x-powered-by');
app.use(helmet.hidePoweredBy());

// Configuración de CORS
const whitelist = process.env.ORIGINS_ALLOWED ? process.env.ORIGINS_ALLOWED.split(',') : ['http://localhost:4200'];

app.use(cors({
    origin: whitelist,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(hpp());

app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Security-Policy', "frame-ancestors 'none'");
    next();
});

app.use(express.json());
app.use(cookieParser());

// API Sync DB
app.use('/db', dbRouter);

// Rutas de app
app.use("/api/v1/projects", projectsRouter);
app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/user-stories", userStoriesRouter);

app.use(errorHandler);

export default app;