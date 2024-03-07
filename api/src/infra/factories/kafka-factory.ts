import { Kafka } from 'kafkajs';

const kafka = new Kafka({
	clientId: 'yape-transference',
	brokers: ['localhost:9092']
});

export { kafka };
