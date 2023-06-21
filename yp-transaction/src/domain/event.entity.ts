export class EventMessages {
    public static TRANSACTION_CREATED:string = "transaction-created"
    public static TRANSACTION_REJECTED:string = "transaction-rejected"
    public static TRANSACTION_APPROVED:string = "transaction-approved"

    public static isEventMessage(message: string): boolean {
        const eventMessages = [
          EventMessages.TRANSACTION_CREATED,
          EventMessages.TRANSACTION_REJECTED,
          EventMessages.TRANSACTION_APPROVED,
        ];
    
        return eventMessages.includes(message);
    }
}

export default interface EventEntity {
    transactionExternalId: string;
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    value: number;
}