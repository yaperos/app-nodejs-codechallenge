"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaTools = void 0;
const kafkajs_1 = require("kafkajs");
const index_1 = require("../config/index");
exports.KafkaTools = {
    instanceKafka() {
        const kafka = new kafkajs_1.Kafka({
            clientId: index_1.environmentVariables.kafka.client_id,
            brokers: index_1.environmentVariables.kafka.brokers
        });
        return kafka;
    }
};
