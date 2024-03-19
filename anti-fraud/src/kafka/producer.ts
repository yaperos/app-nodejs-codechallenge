import {Kafka, Partitioners, Producer} from "kafkajs";

const brokers = [process.env.KAFKA_BROKER ||'localhost:9092']

const topicName = 'anti-fraud-to-transactions'

const clientID = 'CESAR-ANTIFRAUD'


const produce = async (message: string) => {
    const kafka: Kafka = new Kafka({clientId: clientID, brokers: brokers, connectionTimeout: 3000, requestTimeout: 25000})
    const producer: Producer= kafka.producer({createPartitioner: Partitioners.LegacyPartitioner})
    console.log('message produce', message)
    await producer.connect()
    await producer.send({
        topic: topicName,
        messages: [
            {
                key: 'key-cesar-antifraud',
                value: message
            }
        ]
    })
}

export {produce}; 