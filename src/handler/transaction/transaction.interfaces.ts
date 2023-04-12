import { IGetTransactionResponse } from "../../transaction/app/GetTransactionResponse.interface";
import { CreateTransactionBody, ITransactionResponse } from "./interfaces";

export interface ITransactionHandler {
  createTransaction(
    transactionData: CreateTransactionBody
  ): Promise<ITransactionResponse>;
  getTransactionById(transactionId: string): Promise<IGetTransactionResponse>;
}
