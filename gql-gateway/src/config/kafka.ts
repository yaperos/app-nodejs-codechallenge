/* eslint-disable prettier/prettier */
import { KafkaOptions, Transport } from "@nestjs/microservices";
import { GQL_GATEWAY_CONSUMER } from "src/constans/kafka-topics";

export const KAFKA_CLIENT_CONFIG: KafkaOptions = {
    transport: Transport.KAFKA,
    options: {
        client: {
            clientId: 'gql-gateway',
            brokers: ['localhost:9092'],
        },
        consumer: {
            groupId: GQL_GATEWAY_CONSUMER,
        },
    },

}