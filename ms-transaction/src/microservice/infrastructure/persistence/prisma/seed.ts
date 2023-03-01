import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const transactionTypes = await prisma.transactionType.findMany();
  if (transactionTypes.length === 0) {
    await prisma.transactionType.createMany({
      data: [
        {
          name: 'Normal',
        },
      ],
    });
  }

  const transactionStatuses = await prisma.transactionStatus.findMany();
  if (transactionStatuses.length === 0) {
    await prisma.transactionStatus.createMany({
      data: [
        {
          name: 'Pending',
        },
        {
          name: 'Approved',
        },
        {
          name: 'Rejected',
        },
      ],
    });
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
