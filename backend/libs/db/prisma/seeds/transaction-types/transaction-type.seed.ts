import { faker } from "@faker-js/faker";
import { TransactionType } from "@prisma/client";

export const transactionTypesSeed: TransactionType[] = [
  {
    id: faker.string.uuid(),
    name: 'CREDIT',
  },
  {
    id: faker.string.uuid(),
    name: 'DEBIT',
  },
];