
import { Kafka, Partitioners } from "kafkajs"
import dotenv from 'dotenv';
dotenv.config();


export const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT,
  brokers: [process.env.KAFKA_BROKER!],
})


export const kafkaProducerTest = async ( id: string, value: number ) => {
    
    const producer = await kafka.producer({
        createPartitioner: Partitioners.LegacyPartitioner,
    })
    
    const payload = JSON.stringify({ id, value });
    
    await producer.connect()
    await producer.send({
        topic: process.env.KAFKA_TOPIC!,
        messages: [
            { value: payload },
        ],
    })
    await producer.disconnect()
}
