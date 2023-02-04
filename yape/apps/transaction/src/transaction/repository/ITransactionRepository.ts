import {CreateTransactionInput} from "../../../../common/dto/create_transaction_input";
import {ResponseAntiFraudInput} from "../../../../common/dto/response_anti_fraud.input";
import { Transaction } from '@prisma/client'
import {RetrieveTransaction} from "../entities/retrieve_transaction.entity";

export interface ITransactionRepository {
    createTransaction(transaction: CreateTransactionInput): Promise<Transaction>
    updateTransaction(transaction: ResponseAntiFraudInput): Promise<void>
    findTransaction(externalId: string): Promise<RetrieveTransaction>
}