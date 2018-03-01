'use strict';

module.exports = {
  /**
   * Creates blacklist_tokens table
   * @param {any} queryInterface
   * @param {any} Sequelize
   * @returns
   */
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('blacklist_tokens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      token: {
        allowNull: false,
        type: Sequelize.STRING
      },
      exp_date: {
        allowNull: false,
        type: Sequelize.DATE
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
   * Deletes blacklist_tokens table
   * @param {any} queryInterface
   * @param {any} Sequelize
   * @returns
   */
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('blacklist_tokens');
  }
};