import { DataTypes } from 'sequelize'
import sequelize from '../sequelize.js'

const TransactionStatus = sequelize.define('transaction_status', {
  transaction_status_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true,
  freezeTableName: true,
  tableName: 'transaction_status'
})

export default TransactionStatus
