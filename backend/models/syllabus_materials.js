'use strict';
module.exports = (sequelize, DataTypes) => {
  var syllabus_materials = sequelize.define('syllabus_materials', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    material_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'materials',
        key: 'id'
      },
      allowNull: false,
      unique: 'UK01'
    },
    syllabus_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'syllabuses',
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
  return syllabus_materials;
};