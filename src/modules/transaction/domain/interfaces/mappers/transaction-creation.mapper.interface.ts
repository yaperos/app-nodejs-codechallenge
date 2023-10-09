import { Transaction } from "../../entities/transaction.entity";
import { TransferType } from "../../entities/transfer-type.entity";
import { CreateTransactionRequestDto } from "../dtos/transaction-request.dto";

export interface ITransactionCreationMapper {
    transform(data: CreateTransactionRequestDto, transferType: TransferType): Transaction;
}