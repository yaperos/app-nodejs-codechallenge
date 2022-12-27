const { Schema, model } = require('mongoose')

const transactionSchema = Schema({
  accountExternalIdDebit: {
    type: String,
    required: [true, 'El accountExternalIdDebit es obligatorio']
  },
  accountExternalIdCredit: {
    type: String,
    required: [true, 'El accountExternalIdCredit es obligatorio']
  },
  tranferTypeId: {
    type: Number,
    required: [true, 'El transferTypeId es obligatorio']
  },
  value: {
    type: Number,
    required: [true, 'El value es obligatorio']
  }
})

transactionSchema.methods.toJSON = function () {
  const {
    accountExternalIdDebit,
    accountExternalIdCredit,
    __v,
    _id,
    tranferTypeId,
    ...transaction
  } = this.toObject()
  transaction.createdAt = new Date()
  transaction.transactionStatus = {
    name: transaction.value > 1000 ? 'rejected' : 'approved'
  }
  transaction.transactionType = {
    name: ''
  }
  transaction.transactionExternalId = 'Guid'
  return transaction
}
module.exports = model('Transaction', transactionSchema)
