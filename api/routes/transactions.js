const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { produce } = require('../utils/kafka')

// For this project transferTypeId -- transactionType
// 1 - Alpha
// 2 - Betha

const transactionTypeName = {
  ALPHA: 1,
  BETHA: 2
}

module.exports = {
  createTransaction: async (data, req) => {
    const { input } = data

    try {
      const transaction = await prisma.transaction.create({
        data: input,
      });
      prisma.$disconnect;
      produce(transaction.id, transaction)
      return transaction;
    } catch (error) {
      prisma.$disconnect;
      throw new Error(error);
    }
  },
  listTransactions: async ({ input }) => {
    const filters = []
    if (input.transactionExternalId) {
      filters.push({
        OR: [
          { accountExternalIdDebit: input.transactionExternalId },
          { accountExternalIdCredit: input.transactionExternalId },
        ]
      })
    }
    if (input.transactionType) {
      filters.push({
        transferTypeId: transactionTypeName[input.transactionType.name]
      })
    }
    if (input.transactionStatus) {
      filters.push({
        status: input.transactionStatus.name
      })
    }
    if (input.value) {
      filters.push({
        value: input.value
      })
    }
    if (input.createdAt) {
      filters.push({
        createdAt: input.createdAt
      })
    }
    const transactions = await prisma.transaction.findMany({
      where: {
        AND: filters
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    prisma.$disconnect;
    return transactions
  },
  updateTransaction: async ({ id, score }) => {
    const status = score >= 1000 ? 'rejected' : 'approved'
    const transaction = await prisma.transaction.update({
      where: {
        id
      },
      data: {
        value: score,
        status
      }
    })
    global.socketIO.emit('updateTransaction', JSON.stringify({id, status, score}))
    prisma.$disconnect;
    return transaction
  }
};
