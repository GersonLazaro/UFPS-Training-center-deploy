'use strict';

/**
 * Materials Model
 */

/**
 * Instance a material model
 * @param {any} sequelize
 * @param {any} DataTypes
 * @returns
 */

module.exports = (sequelize, DataTypes) => {
  var Materials = sequelize.define('materials', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        len: {
          args: 3,
          msg: "El campo nombre no puede ser vacio."
        }
      }
    },
    category_id: {
      allowNull: true,
      type: DataTypes.INTEGER,
      references:{
        model: 'categories',
        key: 'id'
      }
    },
    description: {
      allowNull: false,
      type: DataTypes.STRING
    },
    url: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    status: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
    },
    user_id:{
      allowNull: true,
      type: DataTypes.INTEGER,
      references:{
        model: 'users',
        key: 'id'
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        Materials.belongsTo( models.categories, {
          onDelete: "NULL",
          foreignKey: {
            allowNull: true
          }
        })

        Materials.belongsTo( models.users, {
          foreignKey: {
            allowNull: true
          }
        })

        Materials.belongsToMany(models.syllabuses, {
          through: 'syllabus_materials',
          as: 'syllabuses'
        })
      }
    },
    underscored: true,
    underscoredAll: true
  });
  return Materials;
};