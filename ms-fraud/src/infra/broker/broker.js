const {config} = require('../../common/config/env.config');
const { Kafka } = require('kafkajs')

const kafka = new Kafka({
  clientId: config.broker_clientId,
  brokers: ['localhost:9092']
})


const producer = kafka.producer()

exports.send = async (topic, messages) => {
  await producer.connect()
  await producer.send({
    topic: topic,
    messages: messages,
  })
  await producer.disconnect()
  return null;
}

exports.consumer = async () => {
  const consumer = kafka.consumer({ groupId: 'yape-fraud' })
  return consumer
}
