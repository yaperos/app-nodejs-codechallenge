'use strict';

const layerPath = process.env.IS_OFFLINE ? './../layer/nodejs' : '/opt/nodejs';
const TransactionModel = require(layerPath + '/models/TransactionModel');

module.exports.handler = (async (event) => {
    for (let key in event.records) {
        const record = event.records[key][0]

        const { id, status } = JSON.parse(Buffer.from(record.value, 'base64').toString())
        const transaction = await TransactionModel.getById(id);
        transaction.update({
            status
        });
        await transaction.save();

    }

});