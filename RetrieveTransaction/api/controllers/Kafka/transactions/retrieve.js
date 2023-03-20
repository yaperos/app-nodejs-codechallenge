// utils
const kafka = require(`@api/helpers/Kafka`)
const { kafka: kafkaEnv } = require(`@config`).services
const { validateTransaction, updatingTransaction } = require(`@api/helpers/Transactions`)
const TransactionsRedisController = require(`@api/controllers/Redis/TransactionsModel`)
const transactionRedis = new TransactionsRedisController()

// Init logger
const path = require(`path`)
const scriptName = path.basename(__filename)
const logger = require(`@loaders/logger`)(scriptName)

module.exports = () => {

    kafka.consumer(async ( transactionExternalId ) => {
      logger.info(
        `✌️ Consumiendo el tópico de entrada ${kafkaEnv.topicInputRetrieveTransaction}`
      )
  
      // Obteniendo parámetros
      try {
        logger.info(`Obteniendo información de la transación: ${transactionExternalId}`)
        const dataTransaction = await transactionRedis.query(transactionExternalId)

        const validation = validateTransaction(dataTransaction)
        logger.info(`La transación: ${transactionExternalId}, es una transacción válida: ${validation}`)

        const newDataTransaction = updatingTransaction({transactionExternalId, dataTransaction, validation})
        await transactionRedis.store({transactionExternalId, transactionData: newDataTransaction})
        
        const message = (validation) ? `La transacción ${transactionExternalId} ha sido aprobada 🥳 🟢` : `La transacción ${transactionExternalId} ha sido rechazada 🥲 🔴`
        
        kafka.producer(message, kafkaEnv.topicInputCreateTransaction)

      } catch (error) {
        logger.error(error)
        // TODO: Realizar algo cuando haya un error
      }
    }, kafkaEnv.topicInputRetrieveTransaction, `message-consumer`)
  
  
  }
  