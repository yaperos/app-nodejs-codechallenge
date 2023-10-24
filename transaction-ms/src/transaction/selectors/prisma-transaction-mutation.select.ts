import { PrismaTransactionQuerySelect } from './prisma-transaction-query.select';

export type PrismaTransactionMutationSelect = {
    select: {
        record: PrismaTransactionQuerySelect;
    };
};