'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
     await queryInterface.bulkInsert('tasks', [
      {id: 1, description: 'Curso Backend', createdAt: new Date(), updatedAt: new Date()},
      {id: 2, description: 'Editar los videos del curso', createdAt: new Date(), updatedAt: new Date()},
      {id: 3, description: 'Subir los videos', createdAt: new Date(), updatedAt: new Date()}
     ], {});
  
  },

  down: async (queryInterface, Sequelize) => {
   
     await queryInterface.bulkDelete('tasks', null, {});
     
  }
};
