import { Kafka, logLevel, Producer, Consumer } from "kafkajs";
import { Buffer } from "buffer";


export type KafkaClientOptions = {
    clientId: string;
    brokers: string[];
};

export function createKafka({ clientId, brokers }: KafkaClientOptions) {
    return new Kafka({
        clientId,
        brokers,
        logLevel: logLevel.NOTHING
    });
}

export async function createProducer(kafka: Kafka): Promise<Producer> {
    const producer = kafka.producer();
    await producer.connect();
    return producer;
}

export async function createConsumer(kafka: Kafka, groupId: string): Promise<Consumer> {
    const consumer = kafka.consumer({ groupId });
    await consumer.connect();
    return consumer;
}

export async function safePublish(
    producer: Producer,
    topic: string,
    key: string,
    value: unknown,
    headers?: Record<string, string>
) {
    await producer.send({
        topic,
        messages: [
            {
                key,
                value: JSON.stringify(value),
                headers: headers ? Object.fromEntries(Object.entries(headers).map(([k, v]) => [k, Buffer.from(v)])) : undefined
            }
        ]
    });
}
