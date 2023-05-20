import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const buildTransaction = (id: number) => ({
  where: { id },
  update: {},
  create: {
    name: `Transaction ${id}`,
  },
});

async function main() {
  const transaction1 = await prisma.transactionType.upsert(buildTransaction(1));
  const transaction2 = await prisma.transactionType.upsert(buildTransaction(2));
  const transaction3 = await prisma.transactionType.upsert(buildTransaction(3));

  console.log({ transaction1, transaction2, transaction3 });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });
