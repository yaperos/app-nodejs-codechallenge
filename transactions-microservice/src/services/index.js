const prisma = require('../libs/prisma')

const { TRANSACTION_TYPES, STATUS_TYPES } = require('../consts')

// validate that the transfer type exists
const existsTransferType = async transferTypeId => {
  const transactionType = await prisma.transactionType.findUnique({
    where: {
      key: TRANSACTION_TYPES.TRANSFER,
    },
  })
  if (!transactionType) throw new Error('Transaction type not found')

  return prisma.operationType.findUnique({
    where: {
      transactionTypeId_operationTypeId: {
        transactionTypeId: transactionType.id,
        operationTypeId: transferTypeId,
      },
    },
  })
}

const saveTransfer = async ({
  accountExternalIdDebit, accountExternalIdCredit, transactionTypeId, operationTypeId, value,
}) => {
  const transactionStatus = await prisma.transactionStatus.findUnique({
    where: {
      key: STATUS_TYPES.PENDING,
    },
  })
  if (!transactionStatus) throw new Error('Transaction status not found')

  return prisma.transaction.create({
    data: {
      accountExternalIdDebit,
      accountExternalIdCredit,
      transactionTypeId,
      operationTypeId,
      transactionStatusId: transactionStatus.id,
      value,
    },
  })
}

const existsTransaction = async transactionExternalId => prisma.transaction.findUnique({
  where: {
    transactionExternalId,
  },
})

const updateTransactionStatus = async ({
  transactionExternalId, statusKey,
}) => {
  const transactionStatus = await prisma.transactionStatus.findUnique({
    where: {
      key: statusKey,
    },
  })
  if (!transactionStatus) throw new Error('Transaction status not found')

  return prisma.transaction.update({
    where: {
      transactionExternalId,
    },
    data: {
      transactionStatusId: transactionStatus.id,
    },
  })
}

const getDetailedTransaction = async transactionExternalId => prisma.transaction.findUnique({
  select: {
    transactionExternalId: true,
    transactionType: {
      select: {
        name: true,
      },
    },
    transactionStatus: {
      select: {
        name: true,
      },
    },
    value: true,
    createdAt: true,
  },
  where: {
    transactionExternalId,
  },
})

module.exports = {
  existsTransferType,
  saveTransfer,
  existsTransaction,
  updateTransactionStatus,
  getDetailedTransaction,
}
