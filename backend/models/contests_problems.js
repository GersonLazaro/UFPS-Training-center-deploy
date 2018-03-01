'use strict';

module.exports = (sequelize, DataTypes) => {

  var contests_problems = sequelize.define('contests_problems', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    problem_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'problems',
        key: 'id'
      },
      allowNull: false,
      unique: 'UK01'
    },
    contest_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'contests',
        key: 'id'
      },
      allowNull: false,
      unique: 'UK01'
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    underscored: true,
    underscoredAll: true
  });
  
  return contests_problems;
};