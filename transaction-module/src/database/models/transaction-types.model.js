import { DataTypes } from 'sequelize'
import sequelize from '../sequelize.js'

const TransactionTypes = sequelize.define('transaction_types', {
  transaction_type_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  timestamps: true
})

export default TransactionTypes
