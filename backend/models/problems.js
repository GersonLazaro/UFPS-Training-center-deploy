'use strict';
module.exports = function (sequelize, DataTypes) {
  var Problems = sequelize.define('problems', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    title_en: {
      allowNull: true,
      type: DataTypes.STRING
    },
    title_es: {
      allowNull: true,
      type: DataTypes.STRING
    },
    time_limit: {
      allowNull: false,
      type: DataTypes.DECIMAL
    },
    level: {
      allowNull: false,
      type: DataTypes.INTEGER,
      validate: {
        max: {
          args: 10,
          msg: "El nivel de dificultad máxima es 10."
        },
        min: {
          args: 1,
          msg: "El nivel de dificultad mínima es 10."
        }
      }
    },
    input: {
      allowNull: false,
      type: DataTypes.STRING
    },
    output: {
      allowNull: false,
      type: DataTypes.STRING
    },
    description_en: {
      allowNull: true,
      type: DataTypes.TEXT
    },
    description_es: {
      allowNull: true,
      type: DataTypes.TEXT
    },
    example_input: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    example_output: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    category_id: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references:{
        model: 'categories',
        key: 'id'
      }
    },
    user_id:{
      allowNull: false,
      type: DataTypes.INTEGER,
      references:{
        model: 'users',
        key: 'id'
      }
    }
  }, {
      classMethods: {
        associate: function ( models ) {
          Problems.belongsTo(models.categories, {
            onDelete: "NULL",
            foreignKey: {
              allowNull: true
            }
          })

          Problems.belongsTo(models.users, {
            onDelete: "CASCADE",
            foreignKey: {
              allowNull: false
            }
          })

          Problems.belongsToMany(models.assignments, {
            through: 'assignment_problems',
            as: 'assignments'
          })

          Problems.belongsToMany(models.contests, {
            through: 'contests_problems',
            as: 'contests',
            onDelete: 'CASCADE'
          })
        }
      },
      underscored: true,
      underscoredAll: true
    });
  return Problems;
};