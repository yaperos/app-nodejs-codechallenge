import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.transactionType.create({
    data: {
      name: 'Cuenta Corriente',
    },
  });

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
