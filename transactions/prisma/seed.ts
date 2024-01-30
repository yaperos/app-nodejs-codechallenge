import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const approved =
    await prisma.statusTransaction.create({
      data: { 
        StatusTransactionId:'APPROVED',
        name: 'APPROVED' 
      },
    });
  const rejected =
    await prisma.statusTransaction.create({
      data: { 
        StatusTransactionId:'REJECTED',
        name: 'REJECTED' 
      },
    });
  const pending =
    await prisma.statusTransaction.create({
      data: { 
        StatusTransactionId:'PENDING',
        name: 'PENDING' 
      },
    });

  // Seed TransactionTypes
  const internal =
    await prisma.transactionType.create({
      data: {
        transactionTypeId: '1',
        name: 'internal',
      },
    });
  const external =
    await prisma.transactionType.create({
      data: {
        transactionTypeId: '2',
        name: 'External',
      },
    });

  const user1 = await prisma.user.create({
    data: {
      email: 'user1@gmail.com',
      name: 'user1',
      userId: 'user1',
    },
  });
  const balancUser1 = await prisma.balance.create(
    {
      data: {
        balanceId: 'balance1u1',
        user: {
          connect: {
            userId: 'user1',
          },
        },
      },
    },
  );

  const user2 = await prisma.user.create({
    data: {
      email: 'user2@gmail.com',
      name: 'user2',
      userId: 'user2',
    },
  });

  const balancUser2 = await prisma.balance.create(
    {
      data: {
        balanceId: 'balance1u2',
        user: {
          connect: {
            userId: 'user2',
          },
        },
      },
    },
  );
  console.log({
    approved,
    rejected,
    pending,
    internal,
    external,
    user1,
    balancUser1,
    user2,
    balancUser2,
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
