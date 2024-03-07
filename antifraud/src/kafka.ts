import { Kafka } from 'kafkajs';

const kafka = new Kafka({
	clientId: 'antifraud-api',
	brokers: ['localhost:9092']
});

export { kafka };