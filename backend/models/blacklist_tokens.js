'use strict';

/**
 * Blaclist Tokens Model
 */

/**
 * Instance a blacklist token model
 * @param {any} sequelize
 * @param {any} DataTypes
 * @returns
 */
module.exports = function(sequelize, DataTypes) {
  var blacklist_tokens = sequelize.define('blacklist_tokens', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    token: DataTypes.STRING,
    exp_date: DataTypes.DATE
  },{
    underscored: true,
    underscoredAll: true
  });
  
  return blacklist_tokens;
};