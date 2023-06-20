export class EventMessages {
    public static TRANSACTION_CREATED:string = "transaction-created"
    public static TRANSACTION_REJECTED:string = "transaction-rejected"
    public static TRANSACTION_APPROVED:string = "transaction-approved"
}

export default interface EventEntity {
    transactionExternalId: string;
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    value: number;
}