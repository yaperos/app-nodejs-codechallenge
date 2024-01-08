import {Producer, Partitioners} from 'kafkajs';
import kafka from "../config/kafka.config";

const producer: Producer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner,
});

export const sendKafkaMessage = async (data: Record<string, any>, topic: string): Promise<void> => {
    const jsonString = JSON.stringify(data);
    await producer.connect();
    await producer.send({topic, messages: [{value: jsonString},],});
    await producer.disconnect();
};
