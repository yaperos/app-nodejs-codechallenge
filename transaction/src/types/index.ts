export enum TransactionStatusEnum {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
}

export enum TransactionStatusCodeEnum {
    PENDING = 100,
    APPROVED = 200,
    REJECTED = 400,
}
export enum TransactionTypeEnum {
    EXTERNAL = 'external',
    INTERNAL = 'internal',
}

export class UpdateTransaction {
    id: string;
    code: number;
}