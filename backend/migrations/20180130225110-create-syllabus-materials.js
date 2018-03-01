'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('syllabus_materials', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      material_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'materials',
          key: 'id'
        },
        allowNull: false
      },
      syllabus_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'syllabuses',
          key: 'id'
        },
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('syllabus_materials');
  }
};