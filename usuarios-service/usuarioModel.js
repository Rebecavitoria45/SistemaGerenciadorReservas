'use strict';

const { DataTypes, UUID } = require('sequelize');

module.exports = (sequelize) => {
  const Usuario = sequelize.define('Usuario', {
    id_usuario: {
      type: UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
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
  }, {
    tableName: 'usuarios',
  });

  return Usuario;
};