'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


  const Usuario = sequelize.define('Usuario', {
    usuario_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  role: {
  type: DataTypes.STRING,
  allowNull: false,
  defaultValue: 'user' 
}
  }, {
    tableName: 'usuarios',
    timestamps: false,
  });

 module.exports = Usuario;