import { Kafka } from 'kafkajs'
import { CONSUMER_GROUP_ID, CONSUMER_TOPIC, KAFKA_BROKER } from '../../shared/config';

export class KafkaInstance {
    private static instance: KafkaInstance;
    client: Kafka

    constructor() {
        this.client = new Kafka({
            clientId: 'my-app',
            brokers: [KAFKA_BROKER]
        })
    }

    public static getInstance(): KafkaInstance {
        if (!this.instance) {
            this.instance = new KafkaInstance();
        }
        return this.instance;
    }

    async producerMessage(topic: string, message: string): Promise<boolean> {
        try {
            const producer = this.client.producer()
            await producer.connect()
            await producer.send({
                topic: topic,
                messages: [
                    { value: message },
                ],
            })
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }

    async consumerMessage(callback : (message: any) => any ): Promise<void> {
        try {
            const consumer = this.client.consumer({ groupId: CONSUMER_GROUP_ID })
            await consumer.connect()
            await consumer.subscribe({ topic: CONSUMER_TOPIC, fromBeginning: true })
            await consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    callback(message.value?.toString())
                },
            })
        } catch (error) {
            console.log(error)
        }
    }

}