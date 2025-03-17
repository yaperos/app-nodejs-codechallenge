import { Prisma } from '@prisma/client';

export class Transaction implements Prisma.TransactionCreateInput {
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  data: string;
}
