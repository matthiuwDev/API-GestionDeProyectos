import db from '../database/database.js';

class UserService {
  getUsers = async (projectId) => {
    const users = await db.User.findAll({
      attributes: ['id', 'name', 'email'],
      include: [
        {
          model: db.Project,
          required: true,
          through: {
            where: { projectId: projectId }
          },
          attributes: []
        }
      ]
    });

    console.log(
      'Usuarios encontrados:',
      users.map((user) => user.toJSON())
    );
    return users;
  };
}

export default new UserService();
