import { DataTypes } from 'sequelize';

export default function (sequelize) {
  const Project = sequelize.define('projects', {
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
    priority: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
        max: 5,
      },
    },
    description: {
      type: DataTypes.STRING
    },
  }, {
    timestamps: true
  });

  Project.associate = function (models) {
    Project.hasMany(models.UserStory, { 
      foreignKey: 'projectId', 
      sourceKey: 'id', 
      onDelete: 'CASCADE' 
    });
  };

  return Project;
}