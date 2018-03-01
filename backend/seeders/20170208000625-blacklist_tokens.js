'use strict';

/**
 * Blacklist tokens Seeder
 */

module.exports = {

  /**
   * Insert tokens into Blacklist Table
   * @param {any} queryInterface
   * @param {any} Sequelize
   * @returns
   */
  up: function (queryInterface, Sequelize) {
  
  },

  /**
   * Delete all the data in Blacklist Table
   * @param {any} queryInterface
   * @param {any} Sequelize
   * @returns
   */
  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('blacklist_tokens', null, {});
  }
};
