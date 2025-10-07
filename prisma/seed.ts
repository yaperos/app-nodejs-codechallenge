import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.transactionStatus.createMany({
    data: [
      { name: 'pendiente' },
      { name: 'aprobado' },
      { name: 'rechazado' },
    ],
    skipDuplicates: true,
  });

  await prisma.transferType.createMany({
    data: [
      { name: 'transferencia bancaria' },
      { name: 'pago de servicio' },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(() => {
    console.log('Seed ejecutado con éxito');
  })
  .catch((e) => {
    console.error('Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
