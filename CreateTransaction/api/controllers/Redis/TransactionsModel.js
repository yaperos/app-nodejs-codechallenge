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

    async store(transactionData) {
        logger.info({ functionExec: `store`, message: `Crear o actualizar registro transactions` })

        try {
            const transactionExternalId = uuid.v4()

            await this.model.createOrUpdate(transactionExternalId, transactionData)

            logger.info(`Se ha creado la transacción con id: ${transactionExternalId}`)

            return transactionExternalId

        } catch (error) {
            console.error(error)
            logger.error({ functionExec: `store transactions`, message: error.message })
        }
    }

}

module.exports = TransactionsRedisController
