'use strict';
const { DataTypes, UUID } = require('sequelize');


module.exports = (sequelize) => {
  const Reserva = sequelize.define('Reserva', {
    id_reserva: {
      type: UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    id_usuario: { 
      type: DataTypes.UUID, 
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
  });


  
  return Reserva;
};