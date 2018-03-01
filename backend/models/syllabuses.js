'use strict';

module.exports = (sequelize, DataTypes) => {
  var Syllabuses = sequelize.define('syllabuses', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    tittle: {
      allowNull: false,
      type: DataTypes.STRING
    },
    description: {
      allowNull: false,
      type: DataTypes.TEXT
    },
    user_id: {
      allowNull: true,
      type: DataTypes.INTEGER,
      references:{
        model: 'users',
        key: 'id'
      }
    },
    public: {
      allowNull: false,
      type: DataTypes.BOOLEAN
    },
    key: {
      allowNull: true,
      type: DataTypes.STRING,
      validate: {
        len: {
          args: 3,
          msg: "Debe proporcionar una contraseña válida."
        }
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        Syllabuses.belongsTo(models.users)
        Syllabuses.belongsToMany(models.materials, {
          through: 'syllabus_materials',
          as: 'materials'
        })
        
        Syllabuses.belongsToMany(models.users, {
          through: 'syllabus_students',
          as: 'users'
        })

        Syllabuses.hasMany( models.assignments, {as: 'assignments'})
      }
    },
    underscored: true,
    underscoredAll: true
  });
  return Syllabuses;
};
