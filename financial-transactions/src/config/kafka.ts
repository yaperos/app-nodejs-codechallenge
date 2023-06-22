/* eslint-disable prettier/prettier */
import { KafkaOptions, Transport } from "@nestjs/microservices";
import { FINANCIAL_TRANSACTIONS_MICROSERVICE_CONSUMER } from "src/constans/kakfa-topics";

export const KAFKA_CLIENT_CONFIG: KafkaOptions = {
    transport: Transport.KAFKA,
    options: {
        client: {
            clientId: 'financial-transactions',
            brokers: ['localhost:9092'],
        },
        consumer: {
            groupId: FINANCIAL_TRANSACTIONS_MICROSERVICE_CONSUMER,
        },
    },

}