import { Kafka, Producer, Consumer } from "kafkajs";

class KafkaAdapter {
    private static instance: KafkaAdapter;
    private kafka: Kafka;
    private producer: Producer;
    private consumer: Consumer;

    constructor(groupId: string) {
        this.kafka = new Kafka({
            clientId: "nodejs-kafka",
            brokers: ['localhost:9093']
        });
        this.producer = this.kafka.producer();
        this.consumer = this.kafka.consumer({ groupId })
    }

    public static getInstance(groupId: string): KafkaAdapter {
        if (!KafkaAdapter.instance) {
            KafkaAdapter.instance = new KafkaAdapter(groupId);
        }

        return KafkaAdapter.instance;
    }

    async produce(topic: string, messages: any) {
        try {
            await this.producer.connect();
            await this.producer.send({
                topic,
                messages
            })
        } catch (error) {
            console.log(error);
        } finally {
            await this.producer.disconnect();
        }
    }

    async consume(topics: string[], callback: Function): Promise<void> {
        try {
            await this.consumer.connect();
            await this.consumer.subscribe({ topics, fromBeginning: true });
            await this.consumer.run({
                eachMessage:async ({ topic, partition, message }) => {
                    const value = message.value;
                    callback(topic, value)
                }
            })
        } catch (error) {
            console.log(error);
        }
    }
}

export default KafkaAdapter;