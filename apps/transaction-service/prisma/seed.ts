import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create transaction statuses
  await prisma.transactionStatus.createMany({
    data: [
      {
        code: 'pending',
        name: 'Pending',
        description: 'Transaction is waiting for approval',
      },
      {
        code: 'approved',
        name: 'Approved',
        description: 'Transaction has been approved',
      },
      {
        code: 'rejected',
        name: 'Rejected',
        description: 'Transaction has been rejected',
      },
    ],
    skipDuplicates: true,
  });

  // Create transaction types
  await prisma.transactionType.createMany({
    data: [{ name: 'TRANSFER' }, { name: 'DEPOSIT' }, { name: 'WITHDRAWAL' }],
    skipDuplicates: true,
  });

  console.log('Seed completed successfully');
}

main()
  .catch(e => {
    console.error('Error in seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
