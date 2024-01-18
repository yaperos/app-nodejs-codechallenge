import { Kafka } from 'kafkajs'
import { config } from '.'

const kafka = new Kafka({
    clientId: config.KAFKA_CLIENT_ID,
    brokers: [config.KAFKA_BROKER]
});


export default kafka