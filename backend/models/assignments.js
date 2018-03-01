'use strict';

module.exports = (sequelize, DataTypes) => {
  var Assignments = sequelize.define('assignments', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    tittle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    init_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    syllabus_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references:{
        model: 'syllabuses',
        key: 'id'
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        Assignments.belongsTo(models.syllabuses)

        Assignments.belongsToMany(models.problems, {
          through: 'assignment_problems',
          as: 'problems'
        })

      }
    },
    underscored: true,
    underscoredAll: true
  });
  return Assignments;
};
