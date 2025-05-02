'use strict';
const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
  const Quarto = sequelize.define('Quarto', {
    numero_quarto: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    preco_noite: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    disponivel: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    capacidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },

  }, {
    tableName: 'quartos', 
    timestamps: false,
  });


  return Quarto;
};