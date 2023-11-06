"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTransactionStatus = exports.sendMessageToMessageQueue = void 0;
const index_1 = require("../../../config/index");
const transactions_dao_1 = require("../../../models/transactions/transactions.dao");
const message_broker_producer_provider_1 = require("../../../providers/message-broker-producer.provider");
const transaction_status_dao_1 = require("../../../models/transaction-status/transaction-status.dao");
const sendMessageToMessageQueue = async (messageQueueOperation, data) => {
    try {
        const kafka = message_broker_producer_provider_1.MessageQueueProducer.getInstance();
        await kafka.sendMessage({
            topic: index_1.environmentVariables.kafka.transaction_topic,
            messages: [{ key: messageQueueOperation, value: JSON.stringify(data) }]
        });
        console.log(`Message sent to Message Queue topic: ${messageQueueOperation}`);
    }
    catch (error) {
        console.log(error);
    }
};
exports.sendMessageToMessageQueue = sendMessageToMessageQueue;
const updateTransactionStatus = async (data) => {
    const aTransactionsDao = new transactions_dao_1.TransactionsDao();
    const aTransactionStatusDao = new transaction_status_dao_1.TransactionStatusDao();
    const transactionStatus = await aTransactionStatusDao.getOne({ name: data.status });
    await aTransactionsDao.update({ transaction_id: data.transaction_id }, { transaction_status_id: transactionStatus.transaction_status_id });
    console.log('Transaction status updated');
};
exports.updateTransactionStatus = updateTransactionStatus;
