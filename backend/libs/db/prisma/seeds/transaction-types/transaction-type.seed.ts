import { TransactionType } from "@prisma/client";

export const transactionTypesSeed: TransactionType[] = [
  {
    id: '872f6272-35db-4205-9779-93ebccde3fa7',
    name: 'CREDIT',
  },
  {
    id: '07f8f172-66eb-42a2-b2d2-ff8eab14cfa3',
    name: 'DEBIT',
  },
];