import { transactionRequest } from "./transaction.dto";

export class CreateTransactionEvent {
    constructor(
        public readonly transactionRequest: transactionRequest,
    ) {}
  
    toString() {
      return JSON.stringify({...this.transactionRequest});
    }
  }