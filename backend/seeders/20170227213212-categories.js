'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {

  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('categories', null, {});
  }
};
