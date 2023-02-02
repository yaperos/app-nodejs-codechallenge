export class TxDto {
    transactionExternalId: string;
    transactionType: TxType;
    transactionStatus: TxStatus
    value: number;
    createdAt: Date;
}

export class TxType {
    id: number;

    name: string;
}

export class TxStatus {
    id: number;

    name: string;
}
