import { PrismaClient, TransactionTypes } from '.prisma/client/transactions';
const prisma = new PrismaClient();
import { randomUUID } from 'node:crypto';

async function main() {
  const transactionsTypeCredit = await prisma.transactionType.create({
    data: {
      id: randomUUID(),
      type: TransactionTypes.CREDIT,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const transactionsTypeDebit = await prisma.transactionType.create({
    data: {
      id: randomUUID(),
      type: TransactionTypes.CREDIT,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const transactionsTypeTransfer = await prisma.transactionType.create({
    data: {
      id: randomUUID(),
      type: TransactionTypes.CREDIT,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log({
    transactionsTypeCredit,
    transactionsTypeDebit,
    transactionsTypeTransfer,
  });
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
