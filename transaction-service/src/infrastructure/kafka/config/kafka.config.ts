import { Kafka } from 'kafkajs';

const kafka = new Kafka({
    clientId: 'yape-app',
    brokers: ['localhost:9092'],
});

export default kafka;
