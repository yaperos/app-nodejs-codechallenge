import { PrismaClient } from '@prisma/client';

// Create new prisma client
const prisma = new PrismaClient();

/**
 * Function used to build Transaction Types for upsert operations
 * @param id ID to use for the new Transaction Type
 * @returns Query to create a new Transaction Type
 */
const buildTransaction = (id: number) => ({
  where: { id },
  update: {},
  create: {
    name: `Transaction ${id}`,
  },
});

async function main() {
  // Build 3 initial transaction types
  const transaction1 = await prisma.transactionType.upsert(buildTransaction(1));
  const transaction2 = await prisma.transactionType.upsert(buildTransaction(2));
  const transaction3 = await prisma.transactionType.upsert(buildTransaction(3));

  console.log({ transaction1, transaction2, transaction3 });
}

main()
  .catch(async (e) => {
    console.error(e);
  })
  .finally(async () => {
    // After execution is completed, close connection
    await prisma.$disconnect();
  });
