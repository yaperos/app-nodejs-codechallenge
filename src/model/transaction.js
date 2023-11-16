const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  transactionExternalId: {
    primary: true,
    type: String,
  },
  accountExternalIdDebit: {
    unique: true,
    type: String,
    require: true
  },
  accountExternalIdCredit: {
    type: String,
    require: true
  },
  transferTypeId: {
    type: Number,
    require: true
  },
  value: {
    type: Number,
    require: true
  },
  transactionStatus: {
    type: String,
    require: true
  }
},
  {
    timestamps: true,
    versionKey: false
  });

module.exports = mongoose.model('transaction', TransactionSchema);