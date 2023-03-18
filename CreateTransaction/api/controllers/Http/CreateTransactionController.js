const uuid = require(`uuid`)
const kafka = require(`@api/helpers/Kafka`)
const responseHelper = require(`@api/helpers/Response`)

// Init logger
const path = require(`path`)
const scriptName = path.basename(__filename)
const logger = require(`@loaders/logger`)(scriptName)

// Variables de entorno
const { services } = require('@/config')
const topicInputRetrieveTransaction = services.kafka.topicInputRetrieveTransaction

class ExpressController {

    receive(req, res) {

        logger.info({ functionExec: `receive`, message: `Transaction received from internet` })

        const quantityOfTransactionsToCreate = req.params.transactions

        const createTransaction = () => {

            const guid = uuid.v4()
            const randomAmount = Math.floor(Math.random() * 1000) + 1

            const transaction = {
                "accountExternalIdDebit": guid,
                "accountExternalIdCredit": guid,
                "tranferTypeId": 1,
                "value": randomAmount
            }

            return transaction
        }

        for (let i = 0; i < quantityOfTransactionsToCreate; i++) {
            kafka.producer(createTransaction(), topicInputRetrieveTransaction)
        }

        const data = `${quantityOfTransactionsToCreate} transactions have been created for processing`
        const response = responseHelper.templateSuccess(data)

        res.send(response)
    }

}

module.exports = ExpressController
