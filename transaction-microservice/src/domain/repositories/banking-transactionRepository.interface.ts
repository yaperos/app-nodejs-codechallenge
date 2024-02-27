import { BankingTransaction } from "../models/banking-transaction";

export interface BankingTransactionRepository {
    save(transaction: BankingTransaction): Promise<BankingTransaction>;
    update(transaction: BankingTransaction): Promise<BankingTransaction>;
}