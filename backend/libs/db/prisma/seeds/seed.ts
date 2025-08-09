import { PrismaClient } from "@prisma/client";

import seedTransactionTypes from "./transaction-types";

const prisma = new PrismaClient();
const seed = async () => {
  await prisma.$transaction(async (trx) => {
    await seedTransactionTypes(trx);
  });
};

seed().catch(console.error).finally(() => prisma.$disconnect());