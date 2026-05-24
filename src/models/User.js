import { DataTypes } from "sequelize";
import bcrypt from 'bcryptjs';

export default function (sequelize) {
  const User = sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },   
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      isEmail: true,          
      validate: {
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      }
    },
    rolId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        const saltRounds = 10;
        user.password = await bcrypt.hash(user.password, saltRounds);
      }
    }
  });

  User.associate = function (models) {
    User.belongsTo(models.Rol, {
      foreignKey: 'rolId',
      targetKey: 'id'
    });
  };

  return User;
}