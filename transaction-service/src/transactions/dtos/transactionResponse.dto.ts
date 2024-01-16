export class TransactionResponseDto {
    transactionExternalId: string;
    transactionType: TransactionType;
    transactionStatus: TransactionStatus;
    value: number;
    createdAt: Date;
}


export class TransactionType {
    name: string;
}

export class TransactionStatus {
    name: string;
}