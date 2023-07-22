import { KafkaOptions, Transport } from "@nestjs/microservices";

export const kafkaConfig: KafkaOptions = {
    transport: Transport.KAFKA,
    options: {
        client: {
            brokers: ["localhost:9092"]
        },
        consumer: {
            groupId: "transaction-consumer",
            allowAutoTopicCreation: true
        }
    }
}