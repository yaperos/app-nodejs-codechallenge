"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageQueueConsumer = exports.MessageQueueConsumer = exports.subscribeMessageQueueManager = void 0;
const kafka_tools_1 = require("../tools/kafka.tools");
const index_1 = require("../config/index");
const messageManagers = {};
const subscribeMessageQueueManager = (data) => {
    messageManagers[`${data.topic}_${data.messageKey}`] = data.function;
};
exports.subscribeMessageQueueManager = subscribeMessageQueueManager;
const handleMessages = async ({ topic, message }) => {
    var _a, _b;
    if (!message.value) {
        return;
    }
    const messageKey = (_a = message.key) === null || _a === void 0 ? void 0 : _a.toString();
    const messageValue = JSON.parse((_b = message.value) === null || _b === void 0 ? void 0 : _b.toString());
    if (!!messageManagers[`${topic}_${messageKey}`] && Object.getOwnPropertyNames(messageValue).length !== 0) {
        console.log(`Consumer received message: ${messageKey}`);
        messageManagers[`${topic}_${messageKey}`](messageValue);
    }
};
class MessageQueueConsumer {
    constructor() {
        this.consumerIsConnected = false;
        const kafka = kafka_tools_1.KafkaTools.instanceKafka();
        this.consumerMessageQueue = kafka.consumer({ groupId: 'consumer2' });
        void this.connectConsumer();
    }
    static getInstance() {
        if (!MessageQueueConsumer.instance) {
            MessageQueueConsumer.instance = new MessageQueueConsumer();
        }
        return MessageQueueConsumer.instance;
    }
    static start() {
        return MessageQueueConsumer.getInstance();
    }
    async connectConsumer() {
        if (!this.consumerIsConnected) {
            await this.consumerMessageQueue.connect();
            await this.consumerMessageQueue.subscribe({ topic: index_1.environmentVariables.kafka.transaction_topic });
            this.consumerIsConnected = true;
            this.consumerMessageQueue.on('consumer.connect', () => {
                console.log('Consumer connected to the message queue');
            });
            this.consumerMessageQueue.on('consumer.disconnect', () => {
                console.log('Consumer connected to the message queue');
            });
            await this.consumerMessageQueue.run({ eachMessage: handleMessages });
        }
    }
}
exports.MessageQueueConsumer = MessageQueueConsumer;
exports.messageQueueConsumer = MessageQueueConsumer.getInstance();
