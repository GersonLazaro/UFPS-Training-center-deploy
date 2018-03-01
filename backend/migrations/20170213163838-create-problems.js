'use strict';
module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('problems', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title_en: {
        allowNull: true,
        type: Sequelize.STRING
      },
      title_es: {
        allowNull: true,
        type: Sequelize.STRING
      },
      time_limit: {
        allowNull: false,
        type: Sequelize.DECIMAL
      },
      level: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      input: {
        allowNull: false,
        type: Sequelize.STRING
      },
      output: {
        allowNull: false,
        type: Sequelize.STRING
      },
      description_en: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      description_es: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      example_input: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      example_output: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      category_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references:{
          model: 'categories',
          key: 'id'
        }
      },
      user_id:{
        allowNull: false,
        type: Sequelize.INTEGER,
        references:{
          model: 'users',
          key: 'id'
        }
      }
    });
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('problems');
  }
};