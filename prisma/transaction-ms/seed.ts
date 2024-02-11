import { PrismaClient } from '.prisma/client/transaction';

const prisma = new PrismaClient();

async function main() {
  const pending = await prisma.status.create({
    data: {
      name: 'PENDING',
    },
  });

  const approved = await prisma.status.create({
    data: {
      name: 'APPROVED',
    },
  });

  const rejected = await prisma.status.create({
    data: {
      name: 'REJECTED',
    },
  });

  const transfer_type_same_bank = await prisma.type.create({
    data: {
      name: 'SAME_BANK',
    },
  });

  const transfer_type_interbank = await prisma.type.create({
    data: {
      name: 'OTHER_BANK',
    },
  });

  console.log({
    pending,
    approved,
    rejected,
    transfer_type_same_bank,
    transfer_type_interbank,
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
