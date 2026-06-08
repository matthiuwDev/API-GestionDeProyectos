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
      unique: true,
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
    role: {
      type: DataTypes.ENUM('ADMIN', 'USER'),
      defaultValue: 'USER',
      allowNull: false
    }
  }, {
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
            const saltRounds = 10;
            user.password = await bcrypt.hash(user.password, saltRounds);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
            const saltRounds = 10;
            user.password = await bcrypt.hash(user.password, saltRounds);
        }
      }
    }
  });

  User.associate = function (models) {
    User.belongsToMany(models.Project, { 
      through: 'projects_users',
      foreignKey: 'userId',
      otherKey: 'projectId'
    });
  };

  return User;
}