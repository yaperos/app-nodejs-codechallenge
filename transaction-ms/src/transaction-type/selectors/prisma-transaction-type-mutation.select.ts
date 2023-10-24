import { PrismaTransactionTypeQuerySelect } from './prisma-transaction-type-query.select';

export type PrismaTransactionTypeMutationSelect = {
    select: {
        record: PrismaTransactionTypeQuerySelect;
    };
};