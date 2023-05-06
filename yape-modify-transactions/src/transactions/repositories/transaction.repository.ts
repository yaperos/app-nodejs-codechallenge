import { Injectable } from '@nestjs/common';
import { Prisma, Transaction } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class TransactionRepository {
    constructor(private prisma: PrismaService) { }

    getTransactions(params: {
        skip?: number;
        take?: number;
        cursor?: Prisma.TransactionWhereUniqueInput;
        where?: Prisma.TransactionWhereInput;
        orderBy?: Prisma.TransactionOrderByWithRelationInput;
    }): Promise<Transaction[]> {
        const { skip, take, cursor, where, orderBy } = params;
        return this.prisma.transaction.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        });
    }

    getTransaction(params: { id: string }): Promise<Transaction> {
        const { id } = params;
        return this.prisma.transaction.findUnique({
            where: { transactionExternalId: id },
        });
    }

    createTransaction(transaction: Transaction): Promise<Transaction> {
        return this.prisma.transaction.create({ data: transaction });
    }

    updateTransaction(transaction: Prisma.TransactionUpdateInput, id: string) {
        return this.prisma.transaction.update({ data: transaction, where: { transactionExternalId: id } })
    }
}