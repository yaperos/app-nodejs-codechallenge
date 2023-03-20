const kafka = require(`@api/helpers/Kafka`)
const responseHelper = require(`@api/helpers/Response`)
const { createTransaction } = require(`@api/helpers/Transactions`)
const TransactionsRedisController = require(`@api/controllers/Redis/TransactionsModel`)
const transactionRedis = new TransactionsRedisController()

// Init logger
const path = require(`path`)
const scriptName = path.basename(__filename)
const logger = require(`@loaders/logger`)(scriptName)

// Variables de entorno
const { services } = require('@/config')
const topicInputRetrieveTransaction = services.kafka.topicInputRetrieveTransaction

class ExpressController {

    async receive(req, res) {

        logger.info({ functionExec: `receive`, message: `Transaction received from internet` })

        const quantityOfTransactionsToCreate = req.params.transactions

        for (let i = 0; i < quantityOfTransactionsToCreate; i++) {
            console.info(` `)
            const transactionData = createTransaction()
            const transactionId = await transactionRedis.store(transactionData)
            
            kafka.producer(transactionId, topicInputRetrieveTransaction)
        }

        const data = `${quantityOfTransactionsToCreate} transactions have been created for processing`
        const response = responseHelper.templateSuccess(data)

        res.send(response)
    }

}

module.exports = ExpressController
