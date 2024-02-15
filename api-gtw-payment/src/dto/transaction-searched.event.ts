
export class SearchTransactionEvent {
    constructor(
        public readonly transactionExternalId: string,
    ) {}
  
    toString() {
      return JSON.stringify({ transactionExternalId: this. transactionExternalId});
    }
  }