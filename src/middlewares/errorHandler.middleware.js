import { AppError } from '../helpers/errors.js';

// Middleware para manejo global de errores
export const errorHandler = (error, req, res, next) => {
    let customError = error;

    // Capturar y traducir errores de Sequelize
    if (error.name === 'SequelizeUniqueConstraintError') {
        const message = error.errors.map(err => {
            // Traducir campos comunes para el cliente de forma amigable
            const field = err.path === 'email' ? 'El correo electrónico' : err.path;
            return `${field} ya está registrado.`;
        }).join(' ');
        customError = new AppError(message, 400);
    } else if (error.name === 'SequelizeValidationError') {
        const message = error.errors.map(err => err.message).join(' ');
        customError = new AppError(message, 400);
    } else if (error.name === 'SequelizeForeignKeyConstraintError') {
        customError = new AppError('Error de relación en base de datos (Llave foránea no válida).', 400);
    } else if (error.name === 'SequelizeDatabaseError') {
        // Evitar exponer la estructura interna de base de datos en producción
        const message = process.env.NODE_ENV === 'production'
            ? 'Ha ocurrido un problema con el almacenamiento de datos.'
            : error.message;
        customError = new AppError(message, 500);
    }

    // Valores por defecto si no es un error controlado (AppError)
    const statusCode = customError.statusCode || 500;
    const status = customError.status || 'ERROR';
    const message = customError.message || 'Error interno del servidor';

    // Log estructurado (se puede expandir para usar Winston/Pino)
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - Error:`, error);

    // Respuesta estandarizada
    const response = {
        status,
        message,
        statusCode
    };

    // Añadir stack trace en modo desarrollo para facilitar debuggin
    if (process.env.NODE_ENV !== 'production') {
        response.stack = error.stack;
    }

    res.status(statusCode).json(response);
};
