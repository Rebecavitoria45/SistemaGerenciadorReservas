'use strict';
const { DataTypes, UUID } = require('sequelize');


module.exports = (sequelize) => {
  const Quarto = sequelize.define('Quarto', {
    id_quarto: {
      type: UUID,
      allowNull: false,
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
  });


  return Quarto;
};