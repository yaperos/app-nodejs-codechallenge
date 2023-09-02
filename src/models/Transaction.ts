import BaseModel from "./BaseModel";

class Transaction extends BaseModel {
  id: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transferType: number;
  value: number;
  status: Transaction.Status;


  static get tableName() {
    return "transactions"
  }

}

namespace Transaction {
  export enum Status {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
  }
}

export default Transaction;