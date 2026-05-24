import { DataTypes } from "sequelize";

export default function (sequelize) {
  const Task = sequelize.define('tasks', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false, 
      validate: { notEmpty: true }
    },
    status: {
      type: DataTypes.ENUM('TODO', 'IN_PROGRESS', 'DONE'),
      defaultValue: "TODO"
    },
  });

  Task.associate = function (models) {
    Task.belongsTo(models.UserStory, { foreignKey: 'userStoryId', targetId: 'id' });
  };

  return Task;
}