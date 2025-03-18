import { KafkaClient, Producer, Consumer } from 'kafka-node';

const kafkaHost = process.env.KAFKA_BROKER || 'localhost:9092';

const client = new KafkaClient({
    kafkaHost,
    requestTimeout: 30000,        
    connectTimeout: 30000,        
});

export const producer = new Producer(client);

export const createConsumer = (topic: string, groupId: string) => {
    const client = new KafkaClient({ kafkaHost });

    const consumer = new Consumer(client, [{ topic }], { 
        groupId, 
        autoCommit: true,
        // fromOffset: true
    });

    consumer.on('error', (err) => console.error(`Error en el Consumer (${topic}):`, err.message));

    return consumer;
};
