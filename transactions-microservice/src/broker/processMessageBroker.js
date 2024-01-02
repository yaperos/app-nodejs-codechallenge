const { logger } = require('../utils/logger')

const { BROKER_ENV } = require('../consts')
const { validateAntiFraudResponse } = require('./validations')
const updateTransactionStatus = require('../app/updateTransactionStatus')

const processMessageBroker = async (topic, rawMessage) => {
  try {
    const message = JSON.parse(rawMessage)
    if (topic === BROKER_ENV.TOPIC_ANTI_FRAUD) {
      const transactionStatus = validateAntiFraudResponse(message)
      await updateTransactionStatus(transactionStatus)
    }
  } catch (e) {
    logger.trace(e, 'Error processing message')
    logger.error({ rawMessage }, 'Invalid Transaction')
  }
}

module.exports = processMessageBroker
