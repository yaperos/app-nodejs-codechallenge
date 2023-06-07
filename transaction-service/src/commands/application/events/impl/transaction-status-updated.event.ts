export class TransactionStatusUpdatedEvent {
    transactionExternalId: string;
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    tranferTypeId: number;
    value: number;
    status: string;
    createdAt: Date;
    action: string;
}