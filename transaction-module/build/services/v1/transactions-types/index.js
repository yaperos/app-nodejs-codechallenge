"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionTypesService = void 0;
const transaction_types_dao_1 = require("../../../models/transaction-types/transaction-types.dao");
class TransactionTypesService {
    async getAll(conditions) {
        const aTransactionsTypesDao = new transaction_types_dao_1.TransactionTypesDao();
        const transactions = await aTransactionsTypesDao.getAll(conditions);
        return transactions;
    }
    async create(params) {
        const aTransactionsTypesDao = new transaction_types_dao_1.TransactionTypesDao();
        const transaction = await aTransactionsTypesDao.create(params);
        return transaction;
    }
}
exports.TransactionTypesService = TransactionTypesService;
