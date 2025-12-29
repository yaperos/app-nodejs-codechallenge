import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Seed Transaction Statuses
  const statuses = ['pending', 'approved', 'rejected'];
  for (const name of statuses) {
    await prisma.transactionStatus.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log('Transaction statuses seeded');

  // Seed Transaction Types
  const types = ['Transferencia', 'Pago de servicios', 'Retiro'];
  for (const name of types) {
    await prisma.transactionType.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log('Transaction types seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
