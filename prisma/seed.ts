import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createTransactionStatuses() {
  await prisma.transactionStatus.create({
    data: {
      name: 'PENDING',
    },
  });

  await prisma.transactionStatus.create({
    data: {
      name: 'APPROVED',
    },
  });

  await prisma.transactionStatus.create({
    data: {
      name: 'REJECTED',
    },
  });
}

async function createTransactionTypes() {
  await prisma.transactionType.create({
    data: {
      name: 'INTERNAL',
    },
  });

  await prisma.transactionType.create({
    data: {
      name: 'EXTERNAL',
    },
  });
}

async function main() {
  try {
    await createTransactionStatuses();
    await createTransactionTypes();
  } catch (err) {
    console.log(err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })

  .catch(async (e) => {
    console.error(e);

    await prisma.$disconnect();

    process.exit(1);
  });
