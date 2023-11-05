"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const message_queue_constants_1 = require("../../constants/message-queue.constants");
const message_broker_consumer_provider_1 = require("../../providers/message-broker-consumer.provider");
const index_1 = require("../../config/index");
const verifyTransaction = async function manageTransaction(data) {
    try {
        if (data.value > 1000) {
            console.log('Transaction rejected');
        }
        console.log('Transaction accepted');
    }
    catch (error) { }
};
(0, message_broker_consumer_provider_1.subscribeMessageQueueManager)({
    function: verifyTransaction,
    messageKey: message_queue_constants_1.MessageKeys.TRANSACTION_CREATED,
    topic: index_1.environmentVariables.kafka.transaction_topic
});
