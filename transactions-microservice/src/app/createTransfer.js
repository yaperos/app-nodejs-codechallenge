const { BadRequest } = require('http-errors')

const { logger } = require('../utils/logger')
const { existsTransferType, saveTransfer } = require('../services')
const { notifyNewTransaction } = require('../services/antiFraudService')

async function createTransfer (transferInfo) {
  const {
    accountExternalIdDebit, accountExternalIdCredit, transferTypeId, value,
  } = transferInfo
  try {
    // validate that the transfer type exists
    const operationType = await existsTransferType(transferTypeId)
    if (!operationType) throw BadRequest(`Operation type ${transferTypeId} not found`)

    // save the transfer
    const transaction = await saveTransfer({
      accountExternalIdDebit,
      accountExternalIdCredit,
      transactionTypeId: operationType.transactionTypeId,
      operationTypeId: operationType.operationTypeId,
      value,
    })
    logger.info(`Transaction ${transaction.transactionExternalId} created successfully`)

    // send to message queue
    await notifyNewTransaction({
      transactionExternalId: transaction.transactionExternalId,
      transactionTypeId: operationType.transactionTypeId,
      value,
      createdAt: transaction.createdAt.toISOString(),
    })

    return transaction
  } catch (e) {
    logger.trace(e, 'Error creating transfer')
    throw e
  }
}

module.exports = createTransfer
