import BaseModel from "./BaseModel";

class Transaction extends BaseModel {
  id: string;
  accountExternalIdDebit: string;
  accountExternalIdCredit: string;
  transferTypeId: number;
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

  export type InputData = {
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    transferTypeId: number;
    value: number;
  }
}

export default Transaction;