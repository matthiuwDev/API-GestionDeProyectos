import { DataTypes } from "sequelize";

export default function (sequelize) {
  const Rol = sequelize.define('roles', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    timestamps: false
  });

  Rol.associate = function (models) {
    Rol.hasMany(models.User, {
      foreignKey: 'rolId',
      sourceKey: 'id'
    });
  };

  return Rol;
}