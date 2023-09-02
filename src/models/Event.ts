import BaseModel from "./BaseModel";

class Event extends BaseModel {
  type: Event.Type;
  value: Event.Data;

  static get tableName() {
    return "transactions"
  }

}

namespace Event {
  export enum Type {
    NEW_TRANSACTION = "NEW_TRANSACTION",
    TRANSACTION_ACCEPTED = "TRANSACTION_ACCEPTED",
    TRANSACTION_REJECTED = "TRANSACTION_REJECTED",
  }

  export type Data = 
    | NewTransaction
    | TransactionAccepted
    | TransactionRejected;

  export interface NewTransaction {
    transactionId: string;
  }

  export interface TransactionAccepted {
    transactionId: string;
  }

  export interface TransactionRejected {
    transactionId: string;
  }

}

export default Event;