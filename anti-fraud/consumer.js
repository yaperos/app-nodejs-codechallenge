"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const kafkajs_1 = require("kafkajs");
const kafka = new kafkajs_1.Kafka({
    clientId: 'anti-fraud',
    brokers: ['localhost:9092'],
});
const consumer = kafka.consumer({ groupId: 'notification-group' });
const producer = kafka.producer();
const handleMessage = ({ topic, partition, message }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    console.log(`Received message from topic '${topic}': ${(_a = message.value) === null || _a === void 0 ? void 0 : _a.toString()}`);
    if (topic === 'new-transaction') {
        console.log('Message received:', (_b = message.value) === null || _b === void 0 ? void 0 : _b.toString());
        yield runProducer((_c = message.value) === null || _c === void 0 ? void 0 : _c.toString());
    }
    else {
        console.log('Unknown topic:', topic);
    }
    yield consumer.commitOffsets([{ topic, partition, offset: message.offset }]);
});
const runConsumer = () => __awaiter(void 0, void 0, void 0, function* () {
    yield consumer.connect();
    yield producer.connect();
    yield consumer.subscribe({ topic: 'new-transaction' });
    console.log('Consumer subscribed to topics: new-transaction');
    yield consumer.run({
        eachMessage: handleMessage,
    });
});
const sendMessage = (topic, message) => __awaiter(void 0, void 0, void 0, function* () {
    yield producer.send({
        topic,
        messages: [{ value: message }],
    });
});
const sendNotification = (topic, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const message = JSON.stringify(payload);
    yield sendMessage(topic, message);
    console.log(`Message sent to ${topic}: ${message}`);
});
const runProducer = (message) => __awaiter(void 0, void 0, void 0, function* () {
    let status;
    let messageDecoded = JSON.parse(message);
    console.log("---> value received: ", messageDecoded.value);
    if (messageDecoded.value > 1000) {
        status = 'rejected';
    }
    else {
        status = 'approved';
    }
    const payload = {
        database_id: messageDecoded.database_id,
        status
    };
    console.log("-------> about to produce!");
    yield sendNotification('anti-fraud', payload);
    // await producer.disconnect();
});
runConsumer()
    .then(() => {
    console.log('Consumer is running...');
})
    .catch((error) => {
    console.error('Failed to run kafka consumer', error);
});
