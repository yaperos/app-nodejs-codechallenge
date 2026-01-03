const { PrismaClient } = require('@prisma/client');
const { sendTransactionEvent } = require('../kafka/producer');

const prisma = new PrismaClient();

async function createTransaction(data) {
  const transaction = await prisma.transaction.create({
    data: {
      accountExternalIdDebit: data.accountExternalIdDebit,
      accountExternalIdCredit: data.accountExternalIdCredit,
      tranferTypeId: data.tranferTypeId,
      amount: Number(data.value),
      status: 'pending'
    }
  });

  await sendTransactionEvent(transaction);
  return transaction;
}

async function updateTransactionStatus(id, status) {
  return prisma.transaction.update({
    where: { id },
    data: { status }
  });
}

async function getTransactionById(id) {
  return prisma.transaction.findUnique({
    where: { id }
  });
}

module.exports = {
  createTransaction,
  updateTransactionStatus,
  getTransactionById
};
