
const transaction = require('../model/transaction');

async function validate(transaction) {
    if (transaction.value > 1000) {
        await updateTransaction(transaction, 'Rejected');
    } else {
        await updateTransaction(transaction, 'Approved');
    }
}

async function updateTransaction(transactionData, status) {
    try {
        const id = transactionData.transactionExternalId;
        const transactionUpdated = transaction.findOneAndUpdate({transactionExternalId: id}, {
            transactionStatus: status
        });
        return transactionUpdated;
    } catch (error) {
        console.log('Error ocurred updating Transaction');
        throw error;
    }
}

module.exports = { validate }