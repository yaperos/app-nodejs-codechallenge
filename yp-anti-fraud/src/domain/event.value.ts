import EventEntity from "./event.entity";


export class EventValue implements EventEntity{
    transactionExternalId: string;
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    value: number;

    constructor({transactionExternalId, accountExternalIdDebit, accountExternalIdCredit, value, eventId}: EventEntity){
        this.transactionExternalId = transactionExternalId;
        this.accountExternalIdCredit = accountExternalIdCredit;
        this.accountExternalIdDebit = accountExternalIdDebit;
        this.value = value;
    }
}