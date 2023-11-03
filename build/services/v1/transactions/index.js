"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const transactions_dao_1 = require("../../../models/transactions/transactions.dao");
class TransactionService {
    async getAll(conditions) {
        const aTransactionsDao = new transactions_dao_1.TransactionsDao();
        const transactions = await aTransactionsDao.getAll(conditions);
        return transactions;
    }
    async create(params) {
        console.log('LOG ~ create ~ params:', params);
        const aTransactionsDao = new transactions_dao_1.TransactionsDao();
        const transaction = await aTransactionsDao.create(params);
        return transaction;
    }
}
exports.TransactionService = TransactionService;
