"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const message_queue_constants_1 = require("../../../constants/message-queue.constants");
const transactions_status_constants_1 = require("../../../constants/transactions-status.constants");
const transactions_dao_1 = require("../../../models/transactions/transactions.dao");
const transaction_status_dao_1 = require("../../../models/transaction-status/transaction-status.dao");
const hooks = __importStar(require("./hooks"));
class TransactionService {
    async getAll(conditions) {
        const aTransactionsDao = new transactions_dao_1.TransactionsDao();
        const transactions = await aTransactionsDao.getAll(conditions);
        return transactions;
    }
    async create(params) {
        const aTransactionsDao = new transactions_dao_1.TransactionsDao();
        const aTransactionStatusDao = new transaction_status_dao_1.TransactionStatusDao();
        const initialTransactionStatus = await aTransactionStatusDao.getOne({ name: transactions_status_constants_1.TransactionStatus.PENDING });
        const transaction = await aTransactionsDao.create({
            ...params,
            transaction_status_id: initialTransactionStatus.transaction_status_id
        });
        // parsear transaction
        await hooks.sendMessageToMessageQueue(message_queue_constants_1.MessageKeys.TRANSACTION_CREATED, transaction);
        return transaction;
    }
}
exports.TransactionService = TransactionService;
