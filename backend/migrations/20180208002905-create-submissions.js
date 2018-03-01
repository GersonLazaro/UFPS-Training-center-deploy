'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('submissions', {
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
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        allowNull: false
      },
      file_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      file_path: {
        allowNull: false,
        type: Sequelize.STRING
      },
      language: {
        allowNull: false,
        type: Sequelize.STRING
      },
      execution_time: {
        allowNull: true,
        type: Sequelize.DOUBLE
      },
      verdict: {
        allowNull: true,
        type: Sequelize.STRING
      },
      status: {
        allowNull: false,
        type: Sequelize.STRING
      },
      assignment_problem_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'assignment_problems',
          key: 'id'
        },
        allowNull: true
      },
      contest_problem_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'contests_problems',
          key: 'id'
        },
        allowNull: true
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
    return queryInterface.dropTable('submissions');
  }
};