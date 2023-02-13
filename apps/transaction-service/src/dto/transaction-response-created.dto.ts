export class TransactionTypeDTO {
    readonly name: string;
}

export class TransactionStatusDTO {
    readonly name: string;
}

export class TransactionCreatedResponseValue {
    readonly value: number;
    readonly transactionExternalId: string;
    readonly createdAt: Date;
    readonly transactionType: TransactionTypeDTO;
    readonly transactionStatus: TransactionStatusDTO;
}

export class TransactionCreatedResponseDTO {
    readonly value: TransactionCreatedResponseValue;
}