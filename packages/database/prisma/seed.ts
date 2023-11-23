import { PrismaClient } from '../dist/prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.transferType.create({
    data: {
      id: 1,
      name: 'Example Transfer Type',
      description: 'This is an example transfer type',
    },
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
