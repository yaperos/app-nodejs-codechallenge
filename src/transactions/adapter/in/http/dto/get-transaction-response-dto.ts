export class GetTransactionResponseDto {

    transactionExternalId: string;
    transactionType: TransactionTypeDto;
    transactionStatus: TransactionStatusDto;
    value: number;
    createAt: Date;
}

export class TransactionTypeDto {
    name: string;
}

export class TransactionStatusDto {
    name: string;
}