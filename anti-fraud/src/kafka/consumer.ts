import {Kafka, Consumer} from "kafkajs";
import {validateAntifraud} from "../logic/validateAntiFraud";
import { ITransactionReceived } from "../models/Transactions";

const brokers = [process.env.KAFKA_BROKER || 'localhost:9092']

console.log('process.env.KAFKA_BROKER', process.env.KAFKA_BROKER)
const topicName = 'transaction-to-anti-fraud'

const clientID = 'CESAR-ANTIFRAUD'

const kafka = new Kafka({clientId: clientID, brokers: brokers})

const consumer: Consumer = kafka.consumer({groupId: clientID})

const consume = async () => {
    await consumer.connect()
    await consumer.subscribe({topics: [topicName], fromBeginning: true})
    await consumer.run({
        eachMessage: async ({topic, partition, message}) => {
            const messageData: ITransactionReceived = JSON.parse(message.value?.toString() || '')
            validateAntifraud(messageData)
        }
    })
}


export {consume}