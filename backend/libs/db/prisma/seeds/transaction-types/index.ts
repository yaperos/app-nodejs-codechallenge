import { Prisma } from "@prisma/client";

import { transactionTypesSeed } from "./transaction-type.seed";

export default async (trx: Prisma.TransactionClient): Promise<void> => {
  await trx.transactionType.createMany({
    data: transactionTypesSeed,
  });

  console.info('Transaction types seeded successfully');
}