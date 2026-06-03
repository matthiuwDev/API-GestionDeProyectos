import db from '../database/database.js';
import bcrypt from 'bcryptjs';

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

        if (invitation && new Date() <= invitation.expiresAt) {
          await db.sequelize.models.projects_users.create(
            {
              projectId: invitation.projectId,
              userId: newUser.id,
              role: 'GUEST',
              status: 'ACCEPTED'
            },
            { transaction }
          );
          await invitation.update({ status: 'CONSUMED' }, { transaction });
        }
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
      throw new Error('Usuario no encontrado');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    console.log('validPassword', validPassword);

    if (!validPassword) {
      throw new Error('La contraseña es incorrecta');
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
