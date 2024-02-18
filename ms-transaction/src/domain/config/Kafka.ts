import {KafkaConstants} from '../constants/Kafka'
import { Kafka } from 'kafkajs'

const kafkaConfig = new Kafka({
    clientId: process.env.KAFKA_CLIENTID || KafkaConstants.DEFAULT_CLIENTID,
    brokers: [process.env.KAFKA_BROKER || KafkaConstants.DEFAULT_BROKER]
});

export default kafkaConfig;