import dotenv from 'dotenv';
dotenv.config(); 
import { EachMessagePayload } from 'kafkajs'
import { dbConnect } from './config/db';
import { ETopicsTransaction } from './@types';
import Producer from './services/producer';
import Consumer from './services/consumer';
import Transaction from './services/transaction';
import logger from './utils/logger';

const run = async () => {
    await dbConnect();

    const producer = new Producer();
    await producer.setup()
    
    const transaction = new Transaction(producer);

    const consumer = new Consumer([
        ETopicsTransaction.EVENT_NEW_TRANSACTION, 
        ETopicsTransaction.EVENT_TRANSACTION_APPROVED, 
        ETopicsTransaction.EVENT_TRANSACTION_REJECTED
    ]);
    await consumer.connectAndSuscriber();

    await consumer.run({
        eachMessage: async ({ topic, message }: EachMessagePayload) => {
            const payload = JSON.parse(message.value!.toString())
            try {
                logger.info(`[RECEIVED] ${topic}`)
                await transaction.dispatch(<ETopicsTransaction>topic, payload)
            } catch (error) {
                logger.error(`[REFUSED] ${topic} - ${(error as Error).message}`)
                logger.error(`[REFUSED] DATA - ${JSON.stringify(payload)}`)
            }
        }
    });
}

run().then(console.log)