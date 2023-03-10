import { TransactionStatus } from "@prisma/client";

export class UpdateTransactionDto {
    transactionStatus: TransactionStatus;
}