// utils
const kafka = require(`@api/helpers/Kafka`)
const { kafka: kafkaEnv } = require(`@config`).services

// Init logger
const path = require(`path`)
const scriptName = path.basename(__filename)
const logger = require(`@loaders/logger`)(scriptName)

module.exports = () => {

    kafka.consumer(async ({ data }) => {
      logger.info(
        `✌️ Consumiendo el tópico de entrada ${kafkaEnv.topicInputCreateTransaction}`
      )
  
      // Obteniendo parámetros
      try {
        const { accountExternalIdDebit, accountExternalIdCredit, tranferTypeId, value } = data
        
      } catch (error) {
        logger.error(error)
        // TODO: Realizar algo cuando haya un error
      }
    }, kafkaEnv.topicInputCreateTransaction, `message-consumer`)
  
  
  }
  