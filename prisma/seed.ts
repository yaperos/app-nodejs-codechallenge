import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const debit = await prisma.transactionType.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Debit',
    },
  })
  const credit = await prisma.transactionType.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: 'Credit',
    },
  })
  const refund = await prisma.transactionType.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      name: 'Refund',
    },
  })
  console.log({ debit, credit, refund });
};

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  });