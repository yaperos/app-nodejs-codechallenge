import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const types = await prisma.transactionType.count();
  const statuses = await prisma.transactionStatus.count();

  if (types === 0)
    await prisma.transactionType.create({
      data: {
        name: 'Cuenta Corriente',
      },
    });

  if (statuses === 0)
    await prisma.transactionStatus.createMany({
      data: [
        {
          name: 'pending',
        },
        {
          name: 'approved',
        },
        {
          name: 'rejected',
        },
      ],
    });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
