import db from '../database/database.js';
import { ForbiddenError, NotFoundError } from '../helpers/errors.js';

//Middleware para Roles Globales (Plataforma)
export const requireGlobalRole = (requiredRoles) => {
  return (req, res, next) => {
    if (!requiredRoles.includes(req.user.role)) {
      return next(new ForbiddenError('Acceso denegado: No tienes los permisos globales necesarios.'));
    }
    next();
  };
};

// Helper: Extraer el projectId desde cualquier tipo de request.
// Se ejecuta DENTRO del router, donde req.params ya tiene los valores correctos.
const resolveProjectId = async (req) => {
  // 1. Directamente desde body o query (caso más explícito)
  if (req.body?.projectId) return Number(req.body.projectId);
  if (req.query?.projectId) return Number(req.query.projectId);

  // 2. Desde params en rutas de proyectos (GET /projects/:id, PUT /projects/:id, etc.)
  if (req.baseUrl.includes('projects') && req.params.id) {
    return Number(req.params.id);
  }

  // 3. Desde params en rutas de recursos que tienen :id (sprint, user-story, task)
  if (req.params.id) {
    const id = Number(req.params.id);

    if (req.baseUrl.includes('sprints')) {
      const sprint = await db.Sprint.findByPk(id, { attributes: ['projectId'] });
      if (sprint) return sprint.projectId;
    }

    if (req.baseUrl.includes('user-stories')) {
      const us = await db.UserStory.findByPk(id, { attributes: ['projectId'] });
      if (us) return us.projectId;
    }

    if (req.baseUrl.includes('tasks')) {
      const task = await db.Task.findByPk(id, {
        include: { model: db.UserStory, attributes: ['projectId'] }
      });
      if (task?.user_story) return task.user_story.projectId;
    }
  }

  // 4. Fallback: userStoryId en query (GET /tasks?userStoryId=7)
  if (req.query?.userStoryId) {
    const us = await db.UserStory.findByPk(Number(req.query.userStoryId), { attributes: ['projectId'] });
    if (us) return us.projectId;
  }

  // 5. Fallback: userStoryId en body (POST /tasks con { userStoryId: X })
  if (req.body?.userStoryId) {
    const us = await db.UserStory.findByPk(Number(req.body.userStoryId), { attributes: ['projectId'] });
    if (us) return us.projectId;
  }

  // 6. Fallback: sprintId en query (GET /user-stories?sprintId=X sin projectId)
  if (req.query?.sprintId) {
    const sprint = await db.Sprint.findByPk(Number(req.query.sprintId), { attributes: ['projectId'] });
    if (sprint) return sprint.projectId;
  }

  return null;
};


//Middleware para Roles de Proyecto
export const requireProjectRole = (requiredRoles) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;
      const projectId = await resolveProjectId(req);

      if (!projectId) {
        return next(new ForbiddenError('No se pudo determinar el proyecto para verificar permisos.'));
      }

      const projectUser = await db.ProjectUsers.findOne({
        where: { userId, projectId }
      });
      console.log('ProjectUser:', projectUser);

      if (!projectUser) {
        throw new NotFoundError('Proyecto no encontrado o no eres miembro de este proyecto.');
      }

      // Inyectamos datos en el request
      req.projectRole = projectUser.role;
      req.projectId = projectId;

      if (!requiredRoles.includes(projectUser.role)) {
        throw new ForbiddenError(`Acceso denegado: Requiere rol ${requiredRoles.join(' o ')} en este proyecto.`);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Middleware específico: Regla híbrida para actualizar User Stories
// (Kanban = todos, cambiar de Sprint = solo OWNER)
export const checkUserStoryUpdatePermissions = () => {
  return (req, res, next) => {
    try {
      const role = req.projectRole; // Inyectado por requireProjectRole
      const isTryingToChangeSprint = req.body?.sprintId !== undefined;

      if (isTryingToChangeSprint && role !== 'OWNER') {
        throw new ForbiddenError('Acceso denegado: Solo el OWNER puede cambiar la historia de sprint o moverla al backlog.');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
