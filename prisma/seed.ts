// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Insertar estados: PENDING, APPROVED, REJECTED
  await prisma.transactionStatus.createMany({
    data: [
      { id: 1, name: 'PENDING' },
      { id: 2, name: 'APPROVED' },
      { id: 3, name: 'REJECTED' },
    ],
    skipDuplicates: true,
  });

  // Insertar tipo de transacción: TRANSFERENCIA
  await prisma.transactionType.createMany({
    data: [
      { id: 1, name: 'TRANSFERENCIA' },
    ],
    skipDuplicates: true,
  });

  console.log('Datos iniciales insertados correctamente');
}

main()
  .catch((e) => {
    console.error('Error ejecutando seed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
