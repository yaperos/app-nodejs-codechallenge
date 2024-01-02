const { NotFound } = require('http-errors')
const { logger } = require('../utils/logger')
const { getDetailedTransaction } = require('../services')

async function getTransaction (transactionExternalId) {
  try {
    const transaction = await getDetailedTransaction(transactionExternalId)
    // validate that the transaction exists
    if (!transaction) throw NotFound(`Transaction ${transactionExternalId} not found`)

    return transaction
  } catch (e) {
    logger.trace(e, 'Error getting transaction')
    throw e
  }
}

module.exports = getTransaction
