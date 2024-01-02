import { UUID } from "crypto";

export interface TransactionResult {
    transactionExternalId: UUID;
    transactionType: { name: string };
    transactionStatus: { name: string };
    value: number;
    createdAt: Date;
}