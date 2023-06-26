'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const transactionSchema = Schema({
    transactionExternalId: { type: String, required: true },
    accountExternalIdDebit: { type: String, required: true },
    accountExternalIdCredit: { type: String, required: true },
    tranferTypeId: { type: Number, required: true },
    value: { type: Number, required: true },
    transactionType: { type: String, required: true },
    transactionStatus: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema)