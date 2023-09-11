import { PrismaClient } from '@prisma/client';

// initialize the Prisma Client
const prisma = new PrismaClient();

async function main() {

  const trasnferType1 = await prisma.transferType.create({
    data: {
       name: 'Ingreso'
    },
  })

  const trasnferType2 = await prisma.transferType.create({
    data: {
      name: 'Salida'
   },
  })
  const transaction1 = await prisma.transaction.create({
    data: {
        accountExternalIdCredit: '069a5c00-83a4-4cb9-b7c3-f192b60bbdde',
        accountExternalIdDebit: '10263a29-2c1a-43f4-bf62-4c03eaef7992',
        transactionExternalId: '10263a29-2c1a-43f4-bf62-4c03eaef7991',
        value: 10.00,
        status: 'approved',
        transferTypeId: 1,
    },
  })

  const transaction2 = await prisma.transaction.create({
    data: {
        accountExternalIdCredit: '069a5c00-83a4-4cb9-b7c3-f192b60bbdde',
        accountExternalIdDebit: '10263a29-2c1a-43f4-bf62-4c03eaef7994',
        transactionExternalId: '10263a29-2c1a-43f4-bf62-4c03eaef7990',
        value: 30.00,
        status: 'approved',
        transferTypeId: 1,
    },
  })

  console.log({ trasnferType1, trasnferType2, transaction1, transaction2 });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close the Prisma Client at the end
    await prisma.$disconnect();
  });