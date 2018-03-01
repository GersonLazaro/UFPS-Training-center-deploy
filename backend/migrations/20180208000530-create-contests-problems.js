'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('contests_problems', {
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
      contest_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'contests',
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
    return queryInterface.dropTable('contests_problems');
  }
};