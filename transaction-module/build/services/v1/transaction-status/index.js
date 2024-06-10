"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionStatusService = void 0;
const transaction_status_dao_1 = require("../../../models/transaction-status/transaction-status.dao");
class TransactionStatusService {
    async getAll(conditions) {
        const aTransactionStatusDao = new transaction_status_dao_1.TransactionStatusDao();
        const transactionStatus = await aTransactionStatusDao.getAll(conditions);
        return transactionStatus;
    }
    async create(params) {
        const aTransactionStatusDao = new transaction_status_dao_1.TransactionStatusDao();
        const transaction = await aTransactionStatusDao.create(params);
        return transaction;
    }
}
exports.TransactionStatusService = TransactionStatusService;
