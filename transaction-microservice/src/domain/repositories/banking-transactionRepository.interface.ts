import { BankingTransaction } from "src/infrastructure/entities/banking-transaction.entity";
import { CreateBankingTransactionInput } from "../models/inputs/create-banking-transaction";
import { UpdateBankingTransactionInput } from "../models/inputs/update-banking-transaction";

export interface BankingTransactionRepository {
    save(transaction: CreateBankingTransactionInput): Promise<BankingTransaction>;
    update(transaction: UpdateBankingTransactionInput): Promise<BankingTransaction>;
}