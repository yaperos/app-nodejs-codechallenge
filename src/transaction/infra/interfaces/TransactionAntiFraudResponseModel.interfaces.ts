import { ETransactionAntiFraudResponse } from "../../app";
import { TransactionModel } from "../TransactionModel";

export interface ITransactionAntiFraudResponseSaveOne {
  transactionStatus: ETransactionAntiFraudResponse;
  transaction: TransactionModel;
}
