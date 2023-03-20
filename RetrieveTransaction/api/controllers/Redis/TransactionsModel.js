const uuid = require(`uuid`)
const Controller = require(`./Controller`)
const TransactionsModel = require(`@api/models/TransactionsModel`)

// Init logger
const path = require(`path`)
const scriptName = path.basename(__filename)
const logger = require(`@loaders/logger`)(scriptName)

class TransactionsRedisController extends Controller {
  constructor() {
    super(new TransactionsModel())
  }

  async store({ transactionExternalId, transactionData }) {
    logger.info({ functionExec: `store`, message: `Crear o actualizar registro transactions` })

    try {
      await this.model.createOrUpdate(transactionExternalId, transactionData)
      logger.info(`Se ha actualzado la transacción con id: ${transactionExternalId}`)

    } catch (error) {
      console.error(error)
      logger.error({ functionExec: `store transactions`, message: error.message })
    }
  }

  async query(transactionExternalId) {
    logger.info({ functionExec: `query`, message: `Obtener registro transactions` })

    try {
      logger.info(`Obteniendo transacción: ${transactionExternalId}`)
      const data = await this.model.find(transactionExternalId)
      return data

    } catch (error) {
      logger.error({ functionExec: `query transactions`, message: error.message })
    }
  }

  async queryAll() {
    logger.info({ functionExec: `query`, message: `Obteniendo todas las transacciones` })

    try {
      const dataTransactions = await this.model.findAll()
      return dataTransactions

    } catch (error) {
      logger.error({ functionExec: `query`, message: error.message })
    }
  }



}

module.exports = TransactionsRedisController
