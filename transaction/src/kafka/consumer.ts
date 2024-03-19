import {Kafka, Consumer} from "kafkajs"
import { updateStatusTransaction } from "../logic/updateStatusTransaction"
import { ITransactionReceived } from "../models/Transaction"

const brokers = [process.env.KAFKA_BROKER ||'localhost:9092']

const topicName = 'anti-fraud-to-transactions'

const clientID = 'CESAR-TRANSACTION'

const kafka = new Kafka({clientId: clientID, brokers: brokers})

const consumer: Consumer = kafka.consumer({groupId: clientID})

const consume = async () => {
    await consumer.connect()
    await consumer.subscribe({topics: [topicName], fromBeginning: true})
    await consumer.run({
        eachMessage: async ({topic, partition, message}) => {

            const dataReceived: ITransactionReceived = JSON.parse(message.value?.toString() || '')
            console.log('llegó aquí')
            await updateStatusTransaction(dataReceived)
        }
    })
}


export {consume}