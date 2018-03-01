'use strict';
module.exports = (sequelize, DataTypes) => {
  var submissions = sequelize.define('submissions', {
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
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id'
      },
      allowNull: false
    },
    file_name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    file_path: {
      allowNull: false,
      type: DataTypes.STRING
    },
    language: {
      allowNull: false,
      type: DataTypes.STRING
    },
    execution_time: {
      allowNull: true,
      type: DataTypes.DOUBLE
    },
    verdict: {
      allowNull: true,
      type: DataTypes.STRING
    },
    status: {
      allowNull: false,
      type: DataTypes.STRING
    },
    assignment_problem_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'assignment_problems',
        key: 'id'
      },
      allowNull: true
    },
    contest_problem_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'contests_problems',
        key: 'id'
      },
      allowNull: true
    }
  }, {
    classMethods: {
      associate: function(models) {
        submissions.belongsTo( models.users )
        submissions.belongsTo( models.problems )
        submissions.belongsTo( models.assignment_problems )
        submissions.belongsTo( models.contests_problems )
      }
    },
    underscored: true,
    underscoredAll: true
  });
  return submissions;
};