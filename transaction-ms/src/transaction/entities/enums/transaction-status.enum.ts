import { registerEnumType } from '@nestjs/graphql';

export enum TransactionStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
}


registerEnumType(TransactionStatus, { name: 'TransactionStatusEnum', description: undefined })
