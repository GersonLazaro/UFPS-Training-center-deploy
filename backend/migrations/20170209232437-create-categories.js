'use strict';

module.exports = {
  /**
   * Creates categories table
   * @param {any} queryInterface
   * @param {any} Sequelize
   * @returns
   */
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('categories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
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
   * Deletes categories table
   * @param {any} queryInterface
   * @param {any} Sequelize
   * @returns
   */
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('categories');
  }
};