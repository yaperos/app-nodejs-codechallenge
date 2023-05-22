import { Transaction as PrismaTransaction } from '@prisma/client';
import { Transaction } from '../../graphql/types/types';

const mapPrismaToGQLTransaction = (transaction: PrismaTransaction): Transaction => (
  { ...transaction, value: Number(transaction.value) }
);

export { mapPrismaToGQLTransaction };
