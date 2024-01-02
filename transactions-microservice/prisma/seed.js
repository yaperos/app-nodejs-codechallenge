const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createTransactionTypes () {
  const response = await Promise.all([
    prisma.transactionType.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        name: 'Transfer',
        key: 'transfer',
      },
    }),
    prisma.transactionType.upsert({
      where: { id: 2 },
      update: {},
      create: {
        id: 2,
        name: 'Payment',
        key: 'payment',
      },
    }),
    prisma.transactionType.upsert({
      where: { id: 3 },
      update: {},
      create: {
        id: 3,
        name: 'Deposit',
        key: 'deposit',
      },
    }),
    prisma.transactionType.upsert({
      where: { id: 4 },
      update: {},
      create: {
        id: 4,
        name: 'Withdrawal',
        key: 'withdrawal',
      },
    }),
  ])
  console.log('Transaction Types created', response)
}

async function createOperationTypes () {
  const response = await Promise.all([
    prisma.operationType.upsert({
      where: {
        transactionTypeId_operationTypeId: { transactionTypeId: 1, operationTypeId: 1 },
      },
      update: {},
      create: {
        transactionTypeId: 1,
        operationTypeId: 1,
        name: 'Simple Transfer',
      },
    }),
    prisma.operationType.upsert({
      where: {
        transactionTypeId_operationTypeId: { transactionTypeId: 1, operationTypeId: 2 },
      },
      update: {},
      create: {
        transactionTypeId: 1,
        operationTypeId: 2,
        name: 'Interbank Transfer',
      },
    }),
    prisma.operationType.upsert({
      where: {
        transactionTypeId_operationTypeId: { transactionTypeId: 1, operationTypeId: 3 },
      },
      update: {},
      create: {
        transactionTypeId: 1,
        operationTypeId: 3,
        name: 'Internal Transfer',
      },
    }),
    prisma.operationType.upsert({
      where: {
        transactionTypeId_operationTypeId: { transactionTypeId: 2, operationTypeId: 1 },
      },
      update: {},
      create: {
        transactionTypeId: 2,
        operationTypeId: 1,
        name: 'Normal Payment',
      },
    }),
    prisma.operationType.upsert({
      where: {
        transactionTypeId_operationTypeId: { transactionTypeId: 3, operationTypeId: 1 },
      },
      update: {},
      create: {
        transactionTypeId: 3,
        operationTypeId: 1,
        name: 'Normal Deposit',
      },
    }),
    prisma.operationType.upsert({
      where: {
        transactionTypeId_operationTypeId: { transactionTypeId: 4, operationTypeId: 1 },
      },
      update: {},
      create: {
        transactionTypeId: 4,
        operationTypeId: 1,
        name: 'Normal Withdrawal',
      },
    }),
  ])
  console.log('Operation Types created', response)
}

async function createTransactionStatuses () {
  const response = await Promise.all([
    prisma.transactionStatus.upsert({
      where: {
        id: 1,
      },
      update: {},
      create: {
        id: 1,
        name: 'Pending',
        key: 'pending',
      },
    }),
    prisma.transactionStatus.upsert({
      where: {
        id: 2,
      },
      update: {},
      create: {
        id: 2,
        name: 'Approved',
        key: 'approved',
      },
    }),
    prisma.transactionStatus.upsert({
      where: {
        id: 3,
      },
      update: {},
      create: {
        id: 3,
        name: 'Rejected',
        key: 'rejected',
      },
    }),
  ])
  console.log('Transaction Statuses created', response)
}

async function main () {
  await createTransactionTypes()
  await createOperationTypes()
  await createTransactionStatuses()
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
