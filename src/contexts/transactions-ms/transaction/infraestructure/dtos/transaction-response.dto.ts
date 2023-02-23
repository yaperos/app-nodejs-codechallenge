export class TransactionResponseDto {
    transactionExternalId: string;
    transactionType: TransactionTypeDto;
    transactionStatus: TransactionStatusDto;
    value: number;
    createdAt: Date;
}

export class TransactionTypeDto {
    name: string;
}

export class TransactionStatusDto {
    name: string;
}
