// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  
  const post1 = await prisma.transactionType.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'transfer'
    },
  });

  const post2 = await prisma.transactionType.upsert({  where: { id: 2 },
    update: {},
    create: {
      name: 'transfer2'
    },
  });

  console.log({ post1, post2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });