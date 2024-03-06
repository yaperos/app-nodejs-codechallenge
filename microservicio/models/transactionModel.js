const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/databaseConfig'); // Importa la instancia de Sequelize desde database.js

const Transaction = sequelize.define('Transaction', {
  accountExternalIdDebit: {
    type: DataTypes.STRING,
    allowNull: false
  },
  accountExternalIdCredit: {
    type: DataTypes.STRING,
    allowNull: false
  },
  transferenciaTypeId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  valor: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  estado: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'pendiente'
  }
});

module.exports = Transaction;
