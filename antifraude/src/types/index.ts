export class ValidateTransaction {
    id: string;
    value: number;
}

export enum TransactionStatusCodeEnum {
    PENDING = 100,
    APPROVED = 200,
    REJECTED = 400,
}