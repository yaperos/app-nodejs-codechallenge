import { ITransaction } from "./transaction/ITransaction";
import { ITransactionStatus, ITransactionStatusFind } from "./transaction/transactionStatus/ITransactionStatus";
import { ITransactionType, ITransactionTypeFind } from "./transaction/transactionType/ITransactionType";

export type IModels = ITransaction | ITransactionStatus | ITransactionType;
export type IModelsFind = ITransactionStatusFind | ITransactionTypeFind;