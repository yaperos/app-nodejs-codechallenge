import { type ConsumerConfig, Kafka, type KafkaConfig, type ProducerConfig } from 'kafkajs';

export interface KafkaModuleOptions {
    clientId: string;
    brokers: string[];
    producerConfig?: ProducerConfig;
    consumerConfig?: ConsumerConfig;
}

export const createKafkaClient = (options: KafkaModuleOptions): Kafka => {
    const kafkaConfig: KafkaConfig = {
        clientId: options.clientId,
        brokers: options.brokers,
        retry: {
            retries: 8,
            initialRetryTime: 100,
            maxRetryTime: 30000,
        },
    };

    return new Kafka(kafkaConfig);
};
