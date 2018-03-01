'use strict';
module.exports = (sequelize, DataTypes) => {
  var syllabus_students = sequelize.define('syllabus_students', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    syllabus_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'syllabuses',
        key: 'id'
      },
      allowNull: false,
      unique: 'UK01'
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
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
  return syllabus_students;
};