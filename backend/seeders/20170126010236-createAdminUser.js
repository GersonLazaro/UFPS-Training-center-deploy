'use strict';

/**
 * Users Seeder
 */

module.exports = {

  /**
   * Insert users into Users Table
   * @param {any} queryInterface
   * @param {any} Sequelize
   * @returns
   */
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('users', [{
      id: 1,
      name: 'Admin',
      email: 'amelisdl@gmail.com',
      password: '$2a$10$6LbPFQDH6/.N.Z4QBs/9puHZgRGfFOZppEa8pqNT9KOK0SiLfNSA.',
      type: 2,
      username: 'admin',
      created_at: Date.now(),
      updated_at: Date.now()
    }], {});
  },

  /**
   * Delete all the data in Users Table
   * @param {any} queryInterface
   * @param {any} Sequelize
   * @returns
   */
  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users', null, {});
  }
};
