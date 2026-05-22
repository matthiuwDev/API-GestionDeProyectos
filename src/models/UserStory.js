import { DataTypes } from "sequelize";

export default function (sequelize) {
  const UserStory = sequelize.define('user_stories', {
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
    description: {
        type: DataTypes.STRING,
        allowNull: true
    }
  });

  UserStory.associate = function (models) {
    UserStory.belongsTo(models.Project, { foreignKey: 'projectId', targetId: 'id' });
    UserStory.hasMany(models.Task, { foreignKey: 'userStoryId', sourceKey: 'id', onDelete: 'CASCADE' });
  };

  return UserStory;
}