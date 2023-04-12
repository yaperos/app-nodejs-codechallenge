import {
  CreateTransactionBody,
  ITransactionResponse,
} from "../handler/transaction/interfaces";
import { IGetTransactionResponse } from "../transaction/app/GetTransactionResponse.interface";

export interface ICreateTransactionArguments {
  transactionData: CreateTransactionBody;
}

export interface IGetTransactionByIdArguments {
  id: string;
}

export interface ISchemaResolvers {
  transaction: (
    args: IGetTransactionByIdArguments
  ) => Promise<IGetTransactionResponse>;
  createTransaction: (
    args: ICreateTransactionArguments
  ) => Promise<ITransactionResponse>;
}
