export class TransactionCreatedEvent {
    transactionExternalId: string;
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    tranferTypeId: number;
    value: number;
    status: string;
    createdAt: Date;
    action: string;
}