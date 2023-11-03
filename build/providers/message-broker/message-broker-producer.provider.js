"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageQueueProducer = void 0;
const kafka_tools_1 = require("../../tools/kafka.tools");
class MessageQueueProducer {
    constructor() {
        this.producerIsConnected = false;
        const kafka = kafka_tools_1.KafkaTools.instanceKafka();
        this.messageQueueProducer = kafka.producer();
    }
    static getInstance() {
        if (!MessageQueueProducer.instance) {
            MessageQueueProducer.instance = new MessageQueueProducer();
        }
        return MessageQueueProducer.instance;
    }
    get isConnected() {
        return this.producerIsConnected;
    }
    async connect() {
        await this.messageQueueProducer.connect();
        this.producerIsConnected = true;
    }
    get producer() {
        return this.messageQueueProducer;
    }
    async sendMessage(record) {
        if (!this.producerIsConnected) {
            await this.connect();
        }
        return await this.messageQueueProducer.send(record);
    }
}
exports.MessageQueueProducer = MessageQueueProducer;
