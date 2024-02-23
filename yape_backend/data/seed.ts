// eslint-disable-next-line @typescript-eslint/no-var-requires
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const load = async () => {
  try {
    // transferTypes
    await prisma.transferType.deleteMany();
    console.log('Deleted records in transferTypes table');

    await prisma.$queryRaw`TRUNCATE TABLE "TransferType" RESTART IDENTITY CASCADE`;
    console.log('reset transferTypes auto increment to 1');

    await prisma.transferType.createMany({
      data: TransferTypes,
    });
    console.log('Added transferTypes data');

    // transactionStatus
    await prisma.transactionStatus.deleteMany();
    console.log('Deleted records in transactionStatus table');

    await prisma.$queryRaw`TRUNCATE TABLE "TransactionStatus" RESTART IDENTITY CASCADE`;
    console.log('reset transactionStatus auto increment to 1');

    await prisma.transactionStatus.createMany({
      data: TransferStatuses,
    });
    console.log('Added transactionStatus data');
  } catch (error) {
    console.error(error);
  }
};

load();

const TransferTypes = [
  {
    id: 1,
    name: 'Transfer',
  },
  {
    id: 2,
    name: 'Deposit',
  },
  {
    id: 3,
    name: 'Withdrawal',
  },
  {
    id: 4,
    name: 'Payment',
  },
  {
    id: 5,
    name: 'Refund',
  },
];
const TransferStatuses = [
  {
    id: 1,
    name: 'Pending',
  },
  {
    id: 2,
    name: 'Approved',
  },
  {
    id: 3,
    name: 'Rejected',
  },
];
