import { Transaction as TransactionModel } from "@prisma/client"

export class TransactionEntity implements TransactionModel {
    id: string;
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    transactionType: number;
    value: number;
    transactionExternalId: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    tranferTypeId: number;
}