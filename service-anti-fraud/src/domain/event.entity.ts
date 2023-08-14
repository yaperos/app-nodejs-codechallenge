export class EventMessages {
    public static TRANSACTION_CREATED:string = "created"
    public static TRANSACTION_REJECTED:string = "rejected"
    public static TRANSACTION_APPROVED:string = "approved"

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