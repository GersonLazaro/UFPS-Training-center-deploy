'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('assignment_problems', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      problem_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'problems',
          key: 'id'
        },
        allowNull: false
      },
      assignment_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'assignments',
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
    return queryInterface.dropTable('assignment_problems');
  }
};