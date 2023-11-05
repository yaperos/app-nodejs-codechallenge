"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessageToMessageQueue = void 0;
const index_1 = require("../../../config/index");
const message_broker_producer_provider_1 = require("../../../providers/message-broker-producer.provider");
const sendMessageToMessageQueue = async (messageQueueOperation, data) => {
    try {
        const kafka = message_broker_producer_provider_1.MessageQueueProducer.getInstance();
        await kafka.sendMessage({
            topic: index_1.environmentVariables.kafka.transaction_topic,
            messages: [{ key: messageQueueOperation, value: JSON.stringify(data) }]
        });
        console.log({ key: messageQueueOperation, value: JSON.stringify(data) });
        console.log(`Message sent to Message Queue topic: ${messageQueueOperation}`);
    }
    catch (error) {
        console.log(error);
    }
};
exports.sendMessageToMessageQueue = sendMessageToMessageQueue;
