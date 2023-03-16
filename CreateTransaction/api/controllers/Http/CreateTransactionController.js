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

    receive (req, res) {

        logger.info({ functionExec: `receive`, message: `Message received from internet` })
        const dataToKafka = {
            "accountExternalIdDebit": "Guid",
            "accountExternalIdCredit": "Guid",
            "tranferTypeId": 1,
            "value": 120
          }

        kafka.producer(dataToKafka,topicInputRetrieveTransaction)

        const data = 'Message received from internet'
        const response = responseHelper.templateSuccess(data)

        res.send(response)
    }

}

module.exports = ExpressController
