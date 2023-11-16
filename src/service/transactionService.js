const transaction = require('../model/transaction');
const { sendMessage } = require('../util/producer');
const { v4: uuidv4 } = require('uuid');
const { consumeMessages } = require('../util/consumer');

async function createTransaction(transactionData) {
    try {
        const newTransaction = transaction({
            transactionExternalId: uuidv4(),
            accountExternalIdDebit: transactionData.accountExternalIdDebit,
            accountExternalIdCredit: transactionData.accountExternalIdCredit,
            transferTypeId: transactionData.transferTypeId,
            value: transactionData.value,
            transactionStatus: 'Pending'
        });
        await newTransaction.save();
        await sendMessageProducer(newTransaction);
        return newTransaction;
    } catch (error) {
        console.log('Error ocurred creating Transaction');
        throw error;
    }
}

async function getTransaction(id) {
    try{
        const transactionFound = await transaction.findOne({ transactionExternalId: id })
        if (!transactionFound) {
            throw "No transactions found";
        }
        return transactionFound
    } catch (error) {
        console.log('Error ocurred getting Transactions');
        throw error;
    }
}

async function validateTransaction(transactionData) {
    await consumeMessages(transactionData);
    console.log('Validation executed');
}

async function sendMessageProducer(transaction) {
    try {
        sendMessage(transaction);
    } catch (error) {
        console.log(error);
        throw new Error(`Error ocurred executing Producer. ${error}`);
    }
}

module.exports = { createTransaction, validateTransaction, getTransaction }