import { DataTypes } from 'sequelize';

export default function (sequelize) {
  const Invitation = sequelize.define('invitations', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true  
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'CONSUMED', 'EXPIRED'),
      allowNull: false,
      defaultValue: 'PENDING'
    },
  }, {
    timestamps: true
  });

  return Invitation;
}