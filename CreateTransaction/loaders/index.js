// Loaders
const redisLoader = require(`./redis`)
const kafkaLoader = require(`./kafka`)
const expressLoader = require('./express')
const loadEventsKafka = require(`@/api/controllers/Kafka`)

// Init logger
const path = require(`path`)
const scriptName = path.basename(__filename)
const logger = require('./logger')(scriptName);

module.exports = async ({ expressApp }) => {

  // Load redis settings
  redisLoader.startConnection()
  logger.info(`✌️ Redis loaded`)

  // Load kafka settings
  kafkaLoader.startConnection()
  logger.info(`✌️ Kafka loaded`)

  // Load express server
  await expressLoader({ app: expressApp })
  logger.info('✌️ Express loaded')

  loadEventsKafka()
  logger.info(`✌️ Kafka Initiated`)

}
