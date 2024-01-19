import dotenv from 'dotenv'; 
dotenv.config(); 
import { EachMessagePayload } from 'kafkajs'
import Consumer from './services/consumer'
import { ETopicsTransaction } from './@types';
import Fraud from './services/fraud';
import Producer from './services/producer';
import logger from './logger';

const run = async () => {
    const producer = new Producer();
    await producer.setup()
    
    const fraud = new Fraud(producer);

    const consumer = new Consumer(
        [ETopicsTransaction.EVENT_NEW_TRANSACTION_FRAUD]
    );
    await consumer.connectAndSuscriber();
    
    await consumer.run({
        eachMessage: async ({ topic, message }: EachMessagePayload) => {
            const payload = JSON.parse(message.value!.toString())
            logger.info(`[RECEIVED] ${topic}`)
            try {
                await fraud.handler(payload);
            } catch (error) {
                logger.error(`[REFUSED] ${topic} - ${(error as Error).message}`)
                logger.error(`[REFUSED] DATA - ${JSON.stringify(payload)}`)
            }
        }
    });
}

run().then(console.log);