'use strict';
const socket = require('../realtime/client');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    
  };
  Task.init({
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Task',
  });

  Task.associate = function(models) {
    Task.belongsTo(models.User,{
      as: 'user',
      foreignKey: 'userId'

    });

    Task.belongsToMany(models.Category,{
      through: 'TaskCategories',
      as: 'categories',
      foreignKey: 'categoryId'

    });
  }
Task.afterCreate(function(task,options) {
  socket.emit('new_task', task);
})


  return Task;
};