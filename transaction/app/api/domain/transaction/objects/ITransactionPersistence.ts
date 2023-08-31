import { Itransaction } from "./ItransactionRequest";

export interface ITransactionPersistence extends Itransaction {
  status: string;
  updatedAt?: Date;
  id?: string;
}
