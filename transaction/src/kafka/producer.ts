import {Kafka, Partitioners, Producer} from "kafkajs";

const brokers = [process.env.KAFKA_BROKER || 'localhost:9092']

const topicName = 'transaction-to-anti-fraud'

const clientID = 'CESAR-TRANSACTION'

/**
 * Funcion que ejecutar el producer del microservicio para enviar datos al consumer de otro microservicio
 * @param message
 */
const produce = async (message: string) => {
    const kafka: Kafka = new Kafka({clientId: clientID, brokers: brokers, connectionTimeout: 3000, requestTimeout: 25000})
    const producer: Producer= kafka.producer({createPartitioner: Partitioners.LegacyPartitioner})

    await producer.connect()
    await producer.send({
        topic: topicName,
        messages: [
            {
                key: 'key-cesar-transaction',
                value: message
            }
        ]
    })
}

export {produce}; 