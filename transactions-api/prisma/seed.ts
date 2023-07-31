import { PrismaClient } from '@prisma/client';

console.log(`Seeding database ${process.env.DATABASE_URL}`);
const prisma = new PrismaClient();

async function main() {
  await prisma.transferType.create({
    data: {
      transferTypeName: 'TX_WIRE_TRANSFER',
    },
  });

  await prisma.transferType.create({
    data: {
      transferTypeName: 'TX_BCP_TRANSFER',
    },
  });
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
