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
const index_1 = require("../../config/index");
const message_queue_constants_1 = require("../../constants/message-queue.constants");
const transactions_status_constants_1 = require("../../constants/transactions-status.constants");
const message_broker_consumer_provider_1 = require("../../providers/message-broker-consumer.provider");
const hooks = __importStar(require("./hooks"));
const verifyTransaction = async function manageTransaction(data) {
    try {
        if (data.value > 1000) {
            console.log('Transaction rejected');
            await hooks.sendMessageToMessageQueue(message_queue_constants_1.MessageKeys.TRANSACTION_STATUS_CHANGED, { ...data, status: transactions_status_constants_1.TransactionStatus.REJECTED });
            return;
        }
        console.log('Transaction accepted');
        await hooks.sendMessageToMessageQueue(message_queue_constants_1.MessageKeys.TRANSACTION_STATUS_CHANGED, { ...data, status: transactions_status_constants_1.TransactionStatus.APPROVED });
    }
    catch (error) { }
};
(0, message_broker_consumer_provider_1.subscribeMessageQueueManager)({
    function: verifyTransaction,
    messageKey: message_queue_constants_1.MessageKeys.TRANSACTION_CREATED,
    topic: index_1.environmentVariables.kafka.transaction_topic
});
