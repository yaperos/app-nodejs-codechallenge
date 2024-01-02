const { logger } = require('../utils/logger')

const isFraudulentTransaction = async transaction => {
  const { value, transactionExternalId } = transaction
  logger.trace({ transaction }, `Calling isFraudulentTransaction ${transactionExternalId} - ${value}`)

  let isFraudulent = false

  if (value > 1000) {
    isFraudulent = true
  }

  logger.debug(`Transaction ${transactionExternalId} - ${value} is fraudulent: ${isFraudulent} ${isFraudulent ? '🚨' : '✅'}`)

  return isFraudulent
}

module.exports = isFraudulentTransaction
