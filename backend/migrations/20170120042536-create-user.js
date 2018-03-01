'use strict';

module.exports = {
  /**
   * Creates Users Table
   * @param {any} queryInterface
   * @param {any} Sequelize
   * @returns
   */
  up: function( queryInterface, Sequelize ) {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      code: {
        type: Sequelize.STRING
      },
      type: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
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
  
  /**
   * Deletes Users Table
   * @param {any} queryInterface
   * @param {any} Sequelize
   * @returns
   */
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('users');
  }
};