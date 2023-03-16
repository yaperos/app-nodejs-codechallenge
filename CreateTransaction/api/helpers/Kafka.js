const { v4 } = require(`uuid`)
const LoaderKafka = require(`@loaders/kafka`)

// Init logger
const path = require(`path`)
const scriptName = path.basename(__filename)
const logger = require(`@loaders/logger`)(scriptName)

const producer = async (msg, topic) => {
  logger.info(`✌️ Enviando ${JSON.stringify(msg)} mensaje al tópico ${topic}`)
  
  try {
    const kafka = LoaderKafka.getConnection()
    const kafkaProducer = kafka.producer()

    await kafkaProducer.connect()
    await kafkaProducer.send({
      topic,
      messages: [
        { value: JSON.stringify(msg) }
      ]
    })

    await kafkaProducer.disconnect()

  } catch (error) {
    logger.error(error)
  }
}

const consumer = async (callback = console.log, topic, groupId) => {
  const id = `${groupId}-${v4()}`

  logger.info(`✌️ Consumiendo mensaje del tópico ${topic} por el consumer ${id}`)
  
  try {
    const kafka = LoaderKafka.getConnection()
    const kafkaConsumer = kafka.consumer({ groupId: id })

    await kafkaConsumer.connect()
    await kafkaConsumer.subscribe({ topic })

    await kafkaConsumer.run({
      eachMessage: ({ _, __, message }) => {
        const response = JSON.parse(message.value.toString())
        callback(response)
      }
    })
  } catch (error) {
    console.error(error)
    logger.error(error)
  }
}

module.exports = {
  producer,
  consumer
}
