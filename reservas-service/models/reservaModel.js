'use strict';
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

  const Reserva = sequelize.define('Reserva', {
    id_reserva: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    usuario_id: { 
      type: DataTypes.INTEGER, 
      allowNull: false,
    },
    numero_quarto: { 
      type: DataTypes.INTEGER, 
      allowNull: false,
    },

    data_reserva: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    check_in: {
      type: DataTypes.DATE, 
      allowNull: false,
    },
    check_out: {
      type: DataTypes.DATE, 
      allowNull: false,
    },
    numero_pessoas: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    preco_reserva: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  }, {
    tableName: 'reservas',
    timestamps: false,
  });

module.exports = Reserva;