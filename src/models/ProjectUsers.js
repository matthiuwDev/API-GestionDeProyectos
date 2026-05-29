import { DataTypes } from 'sequelize';

export default function (sequelize) {
  const ProjectUsers = sequelize.define('projects_users', {
    status: {
      type: DataTypes.ENUM('PENDING', 'ACCEPTED'),
      defaultValue: 'PENDING'
    },
    role: {
      type: DataTypes.ENUM('OWNER', 'GUEST'),
      defaultValue: 'GUEST'
    },
  });

  return ProjectUsers;
}