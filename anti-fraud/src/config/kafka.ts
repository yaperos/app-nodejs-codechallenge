/* eslint-disable prettier/prettier */
import { KafkaOptions, Transport } from "@nestjs/microservices";
import { ANTI_FRAUD_CONSUMER } from "src/constans/kafka-topics";

export const KAFKA_CLIENT_CONFIG: KafkaOptions = {
    transport: Transport.KAFKA,
    options: {
        client: {
            clientId: 'anti-fraud-microservice',
            brokers: ['localhost:9092'],
        },
        consumer: {
            groupId: ANTI_FRAUD_CONSUMER,
        },
    },

}