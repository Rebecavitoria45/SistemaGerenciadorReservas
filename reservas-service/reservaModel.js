'use strict';
const { DataTypes, UUID } = require('sequelize');

module.exports = (sequelize) => {
  const Reserva = sequelize.define('Reserva', {
    id_reserva: {
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