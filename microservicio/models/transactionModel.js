const { DataTypes, literal, Sequelize } = require('sequelize'); // Asegúrate de importar los DataTypes, literal y Sequelize de Sequelize
const { sequelize } = require('../config/databaseConfig');

const Transactions = sequelize.define('Transactions', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  accountexternaliddebit: {
    type: DataTypes.STRING,
    allowNull: false
  },
  accountexternalidcredit: {
    type: DataTypes.STRING,
    allowNull: false
  },
  transferenciatypeid: {
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
  },
  // Cambia 'createdat' a 'createdAt'
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: literal('NOW()') // Valor predeterminado para la fecha de creación
  },
  // Cambia 'updatedat' a 'updatedAt'
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: literal('NOW()') // Valor predeterminado para la fecha de actualización
  },
}, {
  // Define el nombre de la tabla en singular para que coincida con 'Transaction'
  tableName: 'transactions',
  // Define los timestamps en 'true' si quieres que Sequelize maneje automáticamente createdAt y updatedAt
  timestamps: true
});

module.exports = Transactions;
