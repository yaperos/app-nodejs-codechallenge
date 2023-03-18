const { Schema, model } = require('mongoose');
const { schemaBase } = require('../base');
const { transactionType, transactionStatus } = require('../../helpers/enums.js');

const transactionType_enum = transactionType.enums.map(v => v.value);
const transactionStatus_enum = transactionStatus.enums.map(v => v.value);

const modelo = {

    accountExternalIdDebit: {
        type: String,
        // type: Schema.Types.ObjectId,
        // ref: 'AccountExternalDebit',
        required: true,
    },

    accountExternalIdCredit: {
        type: String,
        // type: Schema.Types.ObjectId,
        // ref: 'AccountExternalCredit',
        required: true,
    },

    transactionTypeId: {
        type: Number,
        required: true,
        enum: transactionType_enum,
        default: 1
    },

    value: {
        type: Number,
        required: true,
        default: 0,
    },

    transactionStatusId: {
        type: Number,
        required: true,
        enum: transactionStatus_enum,
        default: 1
    },
};

const schema = Schema(
    Object.assign(modelo, schemaBase), { collection: 'transaccion_financiera' });

schema.method('toJSON', function() {
    const {
        __v,
        _id,
        transactionTypeId,
        transactionStatusId,
        accountExternalIdDebit,
        accountExternalIdCredit,
        ...object
    } = this.toObject();

    object.transactionExternalId = _id;
    object.transactionType = { "name": transactionType.get(transactionTypeId).key };
    object.transactionStatus = { "name": transactionStatus.get(transactionStatusId).key };
    return object;
})

module.exports = model('TransaccionFinanciera', schema);