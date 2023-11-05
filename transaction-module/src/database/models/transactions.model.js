import { DataTypes } from 'sequelize'
import sequelize from '../sequelize.js'
import TransactionStatus from './transaction-status.model.js'
import TransactionTypes from './transaction-types.model.js'

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
  },
  transaction_status_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  timestamps: true
})

Transactions.hasOne(TransactionStatus, {
  foreignKey: 'transaction_status_id',
  sourceKey: 'transaction_status_id'
})

Transactions.hasOne(TransactionTypes, {
  foreignKey: 'transaction_type_id',
  sourceKey: 'transferTypeId'
})

export default Transactions
