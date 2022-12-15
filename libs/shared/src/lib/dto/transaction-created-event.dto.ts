
export class TransactionCreatedEvent {

    transactionExternalId: string;
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    tranferTypeId: number;
    amount: number;

}