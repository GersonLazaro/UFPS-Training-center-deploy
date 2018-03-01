'use strict';

/**
 * Categories Model
 */

/**
 * Instance a category model
 * @param {any} sequelize
 * @param {any} DataTypes
 * @returns
 */
module.exports = function (sequelize, DataTypes) {
  var categories = sequelize.define('categories', {
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
      validate: {
        len: {
          args: [2, 128],
          msg: "El nombre de la catgoria debe tener entre 2 y 128 caracteres."
        }
      }
    }
  }, {
      classMethods: {
        associate: function (models) {
          categories.hasMany( models.problems, {as: 'problems'})
          categories.hasMany( models.materials, {as: 'materials'})
        }
      },
      underscored: true,
      underscoredAll: true
    });
  return categories;
};