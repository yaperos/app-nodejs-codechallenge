import { Injectable } from '@nestjs/common';
import {TransactionRepositoryInterface} from "../../../../Domain/Repositories/TransactionRepositoryInterface";
import {PrismaService} from "../Services/PrismaService";
import {Transaction} from "../../../../Domain/Entities/Transaction";
import {CreateTransactionDto} from "../../../../Domain/Dtos/CreateTransactionDto";
import {Decimal} from "@prisma/client/runtime/edge";
import { TransactionStatus } from '@prisma/client';
import {TransferTypeNotFoundException} from "../../../../Domain/Exceptions/TransferTypeNotFoundException";
import { VALIDATION_ANTI_FRAUD_STATUS } from '../../../../Domain/Constants/CommonConstants';


@Injectable()
export class PrismaTransactionRepository implements TransactionRepositoryInterface {
    constructor(private readonly prisma: PrismaService) {}

    async create(transactionData: CreateTransactionDto): Promise<Transaction> {
        const transferType = await this.prisma.transferType.findUnique({
            where: { id: transactionData.transferTypeId },
        });

        if (!transferType) {
            throw new TransferTypeNotFoundException(transactionData.transferTypeId);
        }

        const transaction = await this.prisma.transaction.create({
            data: {
                ...transactionData,
                value:  new Decimal(transactionData.value),
                status: VALIDATION_ANTI_FRAUD_STATUS.PENDING,
            },
        });

        return this.getResponse({
            ...transaction,
            transferType: transferType,
        });
    }

    async updateStatus(transactionExternalId: string, status: string): Promise<Transaction> {
        const transaction = await this.prisma.transaction.update({
            where: { id: transactionExternalId },
            data: { status: status as TransactionStatus },
        });
        return this.getResponse(transaction);
    }

    async findById(transactionExternalId: string): Promise<Transaction | null> {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id: transactionExternalId },
            include: {
                transferType: true,
            },
        });
        if (!transaction) return null;
        return this.getResponse(transaction);
    }

    private getResponse(transaction: any): Transaction {
        return new Transaction(
            transaction.id,
            transaction.accountExternalIdDebit,
            transaction.accountExternalIdCredit,
            transaction.transferTypeId,
            transaction.transferType?.name,
            transaction.value.toNumber(),
            transaction.status as string,
            transaction.createdAt,
            transaction.updatedAt
        );
    }
}
