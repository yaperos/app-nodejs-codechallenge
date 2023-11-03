import { DataTypes } from 'sequelize'
import sequelize from '../sequelize.js'

const Transactions = sequelize.define('transactions', {
  transaction_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  accountExternalIdDebit: {
    type: DataTypes.STRING,
    allowNull: false
  },
  accountExternalIdCredit: {
    type: DataTypes.STRING,
    allowNull: false
  },
  transferTypeId: {
    type: DataTypes.STRING(2)
  },
  value: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true
})

export default Transactions
