
import { Partitioners } from "kafkajs"
import dotenv from 'dotenv';
import { kafka } from "..";
dotenv.config();


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
