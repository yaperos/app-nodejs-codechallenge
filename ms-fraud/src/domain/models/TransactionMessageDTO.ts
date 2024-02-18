export default class Transaction {
    transactionExternalId: string;
    transactionStatusId:number;
    value: number;

    constructor(
        transactionExternalId: string,
        transactionStatusId:number,
        value: number
    ) {
        this.transactionExternalId= transactionExternalId;
        this.value = value;
        this.transactionStatusId= transactionStatusId;
    }
    
}