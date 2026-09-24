import db from '../database/database.js';
import bcrypt from 'bcryptjs';
import { NotFoundError, UnauthorizedError, BadRequestError } from '../helpers/errors.js';

class AuthService {
    
  createUser = async (userData, inviteToken) => {
    const transaction = await db.sequelize.transaction();

    try {
      const newUser = await db.User.create(userData, { transaction });

      if (inviteToken) {
        const invitation = await db.Invitation.findOne({
          where: {
            token: inviteToken,
            status: 'PENDING'
          },
          transaction
        });

        if (!invitation) {
          throw new BadRequestError('El token de invitación es inválido o ya fue utilizado.');
        }

        if (new Date() > invitation.expiresAt) {
          await invitation.update({ status: 'EXPIRED' }, { transaction });
          throw new BadRequestError('El enlace de invitación ha expirado.');
        }

        if (invitation.email !== userData.email) {
          throw new BadRequestError('El correo del registro no coincide con el de la invitación.');
        }

        await db.sequelize.models.projects_users.create(
          {
            projectId: invitation.projectId,
            userId: newUser.id,
            role: 'GUEST'
          },
          { transaction }
        );
        await invitation.update({ status: 'CONSUMED' }, { transaction });
      }

      await transaction.commit();

      delete newUser.dataValues.password;
      return newUser;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  loginUser = async ({ email, password }) => {
    const user = await db.User.findOne({ where: { email } });

    console.log('USER', user);
    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    console.log('validPassword', validPassword);

    if (!validPassword) {
      throw new UnauthorizedError('La contraseña es incorrecta');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    };
  };
}

export default new AuthService();
