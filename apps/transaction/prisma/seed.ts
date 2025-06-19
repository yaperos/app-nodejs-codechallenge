import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Poblar estados de transacción
  await prisma.transactionStatus.createMany({
    data: [
      { name: 'pending' },
      { name: 'approved' },
      { name: 'rejected' },
    ],
    skipDuplicates: true,
  });

  // Poblar tipos de transacción de ejemplo
  await prisma.transactionType.createMany({
    data: [
      { name: 'transfer' },
      { name: 'payment' },
    ],
    skipDuplicates: true,
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
