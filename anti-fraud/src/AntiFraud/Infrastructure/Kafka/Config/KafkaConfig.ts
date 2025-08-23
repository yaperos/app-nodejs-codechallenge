import {Kafka, logLevel} from 'kafkajs';

export const createKafkaClient = (clientId: string, url: string) => {
    return new Kafka({
        clientId,
        brokers: [url || 'localhost:9092'],
        retry: {
            initialRetryTime: 100,
            retries: 8
        },
        logLevel: logLevel.DEBUG
    });
};
