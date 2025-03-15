import { KafkaClient, Producer, Consumer } from 'kafka-node';

const kafkaHost = process.env.KAFKA_BROKER || 'localhost:9092';

const client = new KafkaClient({ kafkaHost });

export const producer = new Producer(client);
export const createConsumer = (topic: string, groupId: string) => {
    return new Consumer(client, [{ topic }], { groupId, autoCommit: true });
};
