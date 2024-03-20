import { PrismaClient } from '.prisma/client/financial-tracking';
const prisma = new PrismaClient();
import { randomUUID } from 'node:crypto';

async function main() {
  const uuid = randomUUID();
  const customer = await prisma.customer.create({
    data: {
      id: uuid,
      name: 'João Oliveira',
      email: 'joao@oliveira',
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  const account = await prisma.account.create({
    data: {
      id: randomUUID(),
      customer_id: uuid,
      balance: 1000,
      status: 'ACTIVE',
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  console.log({
    customer,
    account,
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
