"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactions = void 0;
const transactions_dao_1 = require("./../../../models/transactions/transactions.dao");
const getTransactions = async () => {
    const transactionsDao = new transactions_dao_1.TransactionsDao();
    const transactions = await transactionsDao.getAll({});
    return transactions.data;
};
exports.getTransactions = getTransactions;
