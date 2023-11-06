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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionStatusDao = void 0;
const transaction_status_model_1 = __importDefault(require("../../database/models/transaction-status.model"));
const transactionsHooks = __importStar(require("./transaction-status.hooks"));
class TransactionStatusDao {
    constructor() {
        this.transactionStatusModel = transaction_status_model_1.default;
        this.getAll = async (conditions) => {
            const transactionStatusConditions = transactionsHooks.conditionsBuilder(conditions);
            const transactionStatus = await this.transactionStatusModel.findAll({
                where: transactionStatusConditions
            });
            return transactionStatus;
        };
        this.getOne = async (conditions) => {
            const transactionStatusConditions = transactionsHooks.conditionsBuilder(conditions);
            const transactionStatus = await this.transactionStatusModel.findOne({
                where: transactionStatusConditions
            });
            return transactionStatus;
        };
        this.create = async (params) => {
            const createdTransactionStatus = await this.transactionStatusModel.create({ ...params });
            return createdTransactionStatus;
        };
        this.bulkCreate = async (transactions) => {
            const transactionsStatusCreated = await this.transactionStatusModel.bulkCreate(transactions);
            return transactionsStatusCreated;
        };
    }
    async clearTable() {
        const transactionsStatusDeleted = await this.transactionStatusModel.destroy({ where: {} });
        return transactionsStatusDeleted;
    }
}
exports.TransactionStatusDao = TransactionStatusDao;
