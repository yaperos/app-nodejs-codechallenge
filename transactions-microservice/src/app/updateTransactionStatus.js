const { logger } = require('../utils/logger')
const { existsTransaction } = require('../services')
const { STATUS_TYPES } = require('../consts')
const { updateTransactionStatus: updateTransactionStatusService } = require('../services')

async function updateTransactionStatus (transactionInfo) {
  const {
    transactionExternalId, isFraudulent,
  } = transactionInfo
  try {
    // validate that the transaction exists
    const transaction = await existsTransaction(transactionExternalId)
    if (!transaction) throw new Error(`Transaction ${transactionExternalId} not found`)

    // update the transaction
    const transactionUpdated = await updateTransactionStatusService({
      transactionExternalId,
      statusKey: isFraudulent ? STATUS_TYPES.REJECTED : STATUS_TYPES.APPROVED,
    })

    logger.info(`Transaction ${transaction.transactionExternalId} updated successfully status to ${transactionUpdated.transactionStatusId}`)

    return transactionUpdated
  } catch (e) {
    logger.trace(e, 'Error updating transaction status')
    throw e
  }
}

module.exports = updateTransactionStatus
