import mongoose from 'mongoose'
import { randomUUID } from 'node:crypto'
import { TransactionStatus } from '@/types/transaction.type'

const transactionSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: function genUuid() {
        return randomUUID()
      },
    },
    transactionId: {
      type: String,
      require: true,
    },
    accountExternalIdDebit: {
      type: String,
      require: true,
    },
    accountExternalIdCredit: {
      type: String,
      require: true,
    },
    tranferTypeId: {
      type: Number,
      require: true,
    },
    value: {
      type: Number,
      require: true,
    },
    transactionStatus: {
      type: TransactionStatus,
      require: true,
    },
    createdAt: {
      type: Date,
      required: true,
      default: new Date()
    }
  },
  {
    timestamps: true,
  }
)

const Transaction = mongoose.model('Transaction', transactionSchema)

export { Transaction }
