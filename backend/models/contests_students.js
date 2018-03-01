'use strict';
module.exports = (sequelize, DataTypes) => {
  var contests_students = sequelize.define('contests_students', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    contest_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'contests',
        key: 'id',
        onDelete: 'CASCADE'
      },
      allowNull: false,
      unique: 'UK01'
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
        onDelete: 'CASCADE'
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
  return contests_students;
};