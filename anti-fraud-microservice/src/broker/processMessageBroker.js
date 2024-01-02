const { logger } = require('../utils/logger')

const { BROKER_ENV } = require('../consts')
const { validateTransaction } = require('./validations')
const isFraudulentTransaction = require('../app/isFraudulentTransaction')
const { notifyAntiFraudResult } = require('../services')

const processMessageBroker = async (topic, rawMessage) => {
  try {
    const message = JSON.parse(rawMessage)
    if (topic === BROKER_ENV.TOPIC_TRANSACTIONS) {
      const transaction = validateTransaction(message)
      const isFraudulent = await isFraudulentTransaction(transaction)
      await notifyAntiFraudResult({
        transactionExternalId: transaction.transactionExternalId,
        isFraudulent,
      })
    }
  } catch (e) {
    logger.trace(e, 'Error processing message')
    logger.error({ rawMessage }, 'Invalid Transaction')
  }
}

module.exports = processMessageBroker
