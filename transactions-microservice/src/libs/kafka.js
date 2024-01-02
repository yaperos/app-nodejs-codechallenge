const { Kafka } = require('kafkajs')
const { BROKER_ENV } = require('../consts')
const { logger } = require('../utils/logger')

const errorTypes = ['unhandledRejection', 'uncaughtException']
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

const kafka = new Kafka({
  clientId: BROKER_ENV.CLIENT_ID,
  brokers: BROKER_ENV.BROKERS,
  retry: {
    initialRetryTime: BROKER_ENV.INITIAL_RETRY_TIME,
  },
})

const manageFailures = async consumerOrProducer => {
  errorTypes.forEach(type => {
    process.on(type, async e => {
      try {
        console.info(`process.on ${type}`)
        console.error(e)
        await consumerOrProducer.disconnect()
        process.exit(0)
      } catch (_) {
        process.exit(1)
      }
    })
  })

  signalTraps.forEach(type => {
    process.once(type, async () => {
      try {
        console.info(`process.once ${type}`)
        await consumerOrProducer.disconnect()
      } finally {
        process.kill(process.pid, type)
      }
    })
  })
}

let producer = null
let consumer = null

const initConsumer = async processMessage => {
  consumer = kafka.consumer({ groupId: BROKER_ENV.GROUP_ID })

  manageFailures(consumer)
  await consumer.connect()

  await consumer.subscribe({
    topic: BROKER_ENV.TOPIC_ANTI_FRAUD,
    fromBeginning: true,
  })

  console.debug('--------------------------------------------------')
  console.debug('Consumer initialized 🍕')
  console.debug('--------------------------------------------------')

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const rawMessage = message.value?.toString()
      logger.trace({
        topic,
        partition,
        message: rawMessage,
      }, 'Message received')

      if (!rawMessage) {
        logger.error({
          topic,
          partition,
          message,
        }, 'Invalid message')
        return
      }

      await processMessage(topic, rawMessage)
    },
  })
}

const initProducer = async () => {
  producer = kafka.producer()

  manageFailures(producer)
  await producer.connect()

  return producer
}

const getProducer = async () => {
  if (producer) {
    return producer
  }

  return initProducer()
}

const getConsumer = async () => {
  if (consumer) {
    return consumer
  }

  return initConsumer()
}

module.exports = {
  getConsumer,
  getProducer,
  initConsumer,
  initProducer,
}
