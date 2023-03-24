export class TransactionCreatedEvent {

    public readonly transactionId: string

    public readonly value: number

    constructor(
        transactionId: string,
        value: number
      ) {
        this.transactionId = transactionId;
        this.value = value;
      }
    

    
}
  