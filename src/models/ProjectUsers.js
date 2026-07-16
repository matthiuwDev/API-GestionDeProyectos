import { DataTypes } from 'sequelize';

export default function (sequelize) {
  const ProjectUsers = sequelize.define('projects_users', {
    role: {
      type: DataTypes.ENUM('OWNER', 'GUEST'),
      allowNull: false,
      defaultValue: 'GUEST'
    },
  });

  return ProjectUsers;
}