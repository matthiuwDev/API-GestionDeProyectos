import config from '../config/config.js';
import db from '../database/database.js';
import sendEmail from '../helpers/sendEmail.js';
import crypto from 'crypto'

class ProjectsService {
  getProjects = async (userId) => {
    return await db.Project.findAll({
      include: {
        model: db.User,
        attributes: ['id', 'name', 'email'],
        where: { id: userId },
        through: {
          attributes: ['role', 'status'],
          where: { status: 'ACCEPTED' }
        }
      }
    });
  };

  getOneProject = async (id) => {
    const project = await db.Project.findByPk(id, {
      include: {
        model: db.UserStory,
        include: [db.Task]
      }
    });

    if (!project) {
      throw new Error(`No se encontró el proyecto con ID ${id}`);
    }

    return project;
  };

  createProject = async (newProject) => {
    const transaction = await db.sequelize.transaction();

    try {
      const project = await db.Project.create(newProject, { transaction });

      await project.addUser(newProject.userId, {
        through: { role: 'OWNER', status: 'ACCEPTED' },
        transaction
      });

      await transaction.commit();
      return project;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  updateProject = async (projectId, changes) => {
    const project = await db.Project.findByPk(projectId);

    if (!project) {
      throw new Error(`Proyecto no encontrado`);
    }

    await project.update(changes);
    return project;
  };

  deleteProject = async (projectId) => {
    const deletedRows = await db.Project.destroy({
      where: { id: projectId }
    });

    if (deletedRows === 0) {
      throw new Error(`Proyecto no encontrado`);
    }
    return true;
  };

  inviteUserProject = async (userEmail, projectId, inviter) => {
    const verificationToken = crypto.randomBytes(40).toString('hex');
    
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    const userBody = {
      email: userEmail,
      projectId: projectId,
      status: "PENDING",
      token: verificationToken,
      expiresAt: expiresAt
    }
    console.log("userBody: ", userBody);

    const invitedUser = await db.Invitation.create(userBody);
    console.log("invitedUser: ", invitedUser);

    const project = await db.Project.findByPk(projectId);
    console.log("project: ", project);

    await sendEmail({
      to: invitedUser.email,
      subject: 'Invitación a Proyecto',
      template: 'invitationTemplate',
      data: {
        appName: 'Gestor de Proyectos',
        userName: userEmail.split('@')[0],
        inviterName: inviter.name,
        projectName: project.name,
        actionUrl: `${config.URL_WEB}/#/activate/${verificationToken}`
      }
    });
  }

  acceptInvitation = async (token, userId) => {
    const invitation = await db.Invitation.findOne({
      where: { 
        token: token,
        status: 'PENDING'
      }
    });

    if (!invitation) {
      throw new Error('La invitación no existe o ya fue utilizada');
    }

    if (new Date() > invitation.expiresAt) {
      await invitation.update({
        status: "EXPIRED"
      })
      throw new Error('El enlace de invitación ha expirado');
    }

    await db.sequelize.models.projects_users.create({
      projectId: invitation.projectId,
      userId: userId,
      role: 'GUEST',
      status: 'ACCEPTED'
    });

    await invitation.update({ status: 'CONSUMED' });

    return true;
  }
}

export default new ProjectsService();
