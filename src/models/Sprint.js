import { DataTypes } from 'sequelize';

export default function (sequelize) {
  const Sprint = sequelize.define('sprints', {
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
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    goal: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'ACTIVE', 'COMPLETED'),
      allowNull: false,
      defaultValue: 'PENDING',
    },
  }, {
    timestamps: true
  });

  Sprint.associate = function (models) {
    Sprint.belongsTo(models.Project, { 
      foreignKey: 'projectId', 
      targetId: 'id' 
    });
    
    Sprint.hasMany(models.UserStory, { 
      foreignKey: 'sprintId', 
      sourceKey: 'id' 
    });
  };

  return Sprint;
}
