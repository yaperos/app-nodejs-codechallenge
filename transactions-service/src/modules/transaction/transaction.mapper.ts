import { Transaction as PrismaTransaction } from '@prisma/client';
import { Transaction } from '../../graphql/types/types';

/**
 * Function to transform a Prisma Transaction object to a GQL Transaction object
 * @param {PrismaTransaction} transaction Prisma Transaction object to transform
 * @returns {Transaction} A GQL Transaction object
 */
const mapPrismaToGQLTransaction = (transaction: PrismaTransaction): Transaction => (
  { ...transaction, value: Number(transaction.value) }
);

export { mapPrismaToGQLTransaction };
