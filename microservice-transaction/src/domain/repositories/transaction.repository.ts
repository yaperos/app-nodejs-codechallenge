import { Transaction } from "../aggregates/transaction";

interface TransactionRepository {
    createTransaction(transaction: Transaction): Promise<Transaction>;
    getTransactionById(id: string): Promise<Transaction>;
}

export default TransactionRepository;