import config from '../config/config.js';
import db from '../database/database.js';
import sendEmail from '../helpers/sendEmail.js';
import crypto from 'crypto';
import { NotFoundError, BadRequestError } from '../helpers/errors.js';

class ProjectsService {
  //Verificar estado de la invitación
  isInvitationActive(invitation) {
    return (
      invitation &&
      invitation.status === 'PENDING' &&
      invitation.expiresAt > new Date()
    );
  }

  getProjects = async (userId) => {
    return await db.Project.findAll({
      include: {
        model: db.User,
        attributes: ['id', 'name', 'email'],
        where: { id: userId },
        through: {
          attributes: ['role']
        }
      }
    });
  };

  getOneProject = async (id, userId) => {
    const project = await db.Project.findByPk(id, {
      include: [
        {
          model: db.UserStory,
          include: [db.Task]
        },
        {
          model: db.User,
          where: { id: userId },
          attributes: ['id'],
          through: { attributes: [] },
          required: true
        }
      ]
    });

    if (!project) {
      throw new NotFoundError(`No se encontró el proyecto con ID ${id} o no tienes acceso.`);
    }

    return project;
  };

  // getProjectUsersInvitations = async (id) => {
  //   const userInvitations = await db.Invitation.findAll({
  //     where: { projectId: id },
  //     attributes: ['id', 'email', 'status', 'createdAt', 'expiresAt']
  //   });

  //   return userInvitations;
  // };

  // Método para obtener los usuarios existentes del proyecto y sus invitaciones (Incluyendo nombres)
  getProjectUsersInvitations = async (id) => {
    const project = await db.Project.findByPk(id, {
      include: {
        model: db.User,
        through: { attributes: ['role'] },
        attributes: ['email', 'name']
      }
    });

    if (!project) throw new NotFoundError('Proyecto no encontrado');

    const activeMembers = project.users.map((user) => ({
      email: user.email,
      status: 'CONSUMED',
      createdAt: user.projects_users.createdAt,
      expiresAt: null,
      name: user.name,
      canResend: false,
      role: user.projects_users.role
    }));
    console.log('Active Members:', activeMembers);

    const userInvitations = await db.Invitation.findAll({
      where: { 
        projectId: id,
        status: ['PENDING', 'EXPIRED']
      },
      attributes: ['id', 'email', 'status', 'createdAt', 'expiresAt'],
      raw: true
    });

    let mappedInvitations = [];
    
    if (userInvitations.length > 0) {
      const emailsToSearch = userInvitations.map((inv) => inv.email);

      const existingUsers = await db.User.findAll({
        where: { email: emailsToSearch },
        attributes: ['email', 'name'],
        raw: true
      });

      const userMap = {};
      existingUsers.forEach((user) => {
        userMap[user.email] = user.name;
      });

      mappedInvitations = userInvitations.map((invitation) => {
        const isActive = this.isInvitationActive(invitation);

        return {
          ...invitation,
          name: userMap[invitation.email] || 'Usuario no registrado',
          canResend: !isActive
        };
      });
    }

    return [...activeMembers, ...mappedInvitations];
  };

  createProject = async (newProject) => {
    const transaction = await db.sequelize.transaction();

    try {
      const project = await db.Project.create(newProject, { transaction });

      await project.addUser(newProject.userId, {
        through: { role: 'OWNER' },
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
      throw new NotFoundError(`Proyecto no encontrado`);
    }

    await project.update(changes);
    return project;
  };

  deleteProject = async (projectId) => {
    const deletedRows = await db.Project.destroy({
      where: { id: projectId }
    });

    if (deletedRows === 0) {
      throw new NotFoundError(`Proyecto no encontrado`);
    }
    return true;
  };

  inviteUserProject = async (userEmail, projectId, inviter) => {
    const existingUser = await db.User.findOne({ where: { email: userEmail } });
    
    if (existingUser) {
      const isMember = await db.sequelize.models.projects_users.findOne({
        where: { projectId, userId: existingUser.id }
      });
      
      if (isMember) {
        throw new BadRequestError('El usuario ya es miembro de este proyecto.');
      }
    }

    const invitation = await db.Invitation.findOne({
      where: {
        email: userEmail,
        projectId
      }
    });

    const isActive = this.isInvitationActive(invitation);

    if (isActive) {
      throw new BadRequestError('Ya existe una invitación vigente para este usuario.');
    }

    const verificationToken = crypto.randomBytes(40).toString('hex');

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    let invitedUser;

    if (!invitation) {
      invitedUser = await db.Invitation.create({
        email: userEmail,
        projectId,
        status: 'PENDING',
        token: verificationToken,
        expiresAt
      });
    } else {
      invitation.status = 'PENDING';
      invitation.token = verificationToken;
      invitation.expiresAt = expiresAt;

      invitedUser = await invitation.save();
    }

    const project = await db.Project.findByPk(projectId);

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

    return invitedUser;
  };

  acceptInvitation = async (token, userId) => {
    const invitation = await db.Invitation.findOne({
      where: {
        token: token,
        status: 'PENDING'
      }
    });

    if (!invitation) {
      throw new NotFoundError('La invitación no existe o ya fue utilizada');
    }

    if (new Date() > invitation.expiresAt) {
      await invitation.update({
        status: 'EXPIRED'
      });
      throw new BadRequestError('El enlace de invitación ha expirado');
    }

    await db.sequelize.models.projects_users.create({
      projectId: invitation.projectId,
      userId: userId,
      role: 'GUEST'
    });

    await invitation.update({ status: 'CONSUMED' });

    return true;
  };
}

export default new ProjectsService();
