export const KAFKA_CONFIG = {
    client: {
        clientId: 'antifraud',
        brokers: ['localhost:9092'],
    },
    consumer: {
        groupId: 'antifraud-consumer'
    },
    producer: {
        // Producer configuration
    },
};
