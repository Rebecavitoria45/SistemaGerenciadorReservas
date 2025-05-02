'use strict';
const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
  const Reserva = sequelize.define('Reserva', {
    id_reserva: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_usuario: { 
      type: DataTypes.INTEGER, 
      allowNull: false,
    },
    id_quarto: { 
      type: DataTypes.INTEGER, 
      allowNull: false,
    },

    data_reserva: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    check_in: {
      type: DataTypes.INTEGER, 
      allowNull: false,
    },
    check_out: {
      type: DataTypes.INTEGER, 
      allowNull: false,
    },
    numero_pessoas: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  }, {
    tableName: 'reservas',
    timestamps: false,
  });


  
  return Reserva;
};