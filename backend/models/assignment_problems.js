'use strict';
module.exports = (sequelize, DataTypes) => {
  var assignment_problems = sequelize.define('assignment_problems', {
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
    assignment_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'assignments',
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
  return assignment_problems;
};