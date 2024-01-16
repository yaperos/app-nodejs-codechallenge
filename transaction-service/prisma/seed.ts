import { PrismaClient } from './generated/client';

const prisma = new PrismaClient();

async function main() {
  const newTransaction = await prisma.transaction.create({
    data: {
      uuid: '18b1992a-2cc8-454b-94e3-e69f6610905c',
      accountExternalIdDebit: 'b5b70a6f-857a-49e9-8604-7adf2846d4be',
      accountExternalIdCredit: '340fb83e-1f06-4435-aeb0-2db3a432685f',
      transferTypeId: 1,
      value: 443.5,
      status: 'pending', // Suponiendo que el estado es necesario, puedes ajustarlo según tus necesidades
    },
  });

  console.log(`New transaction created: `, newTransaction);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
});
