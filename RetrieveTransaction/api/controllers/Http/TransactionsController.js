const responseHelper = require(`@api/helpers/Response`)
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

        const data = await transactionRedis.queryAll()
        
        const response = responseHelper.templateSuccess(data)

        res.send(response)
    }

}

module.exports = ExpressController
