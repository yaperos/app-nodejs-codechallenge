import { Transaction } from "../../entities/transaction.entity";
import { ITransactionInfo } from "../transaction-info.interface";

export interface ITransactionInfoMapper {
    transform(data: Transaction): ITransactionInfo;
}