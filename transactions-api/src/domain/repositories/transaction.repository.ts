import { Transaction } from "../transaction";

export interface TransactionRepository {
    getById(transactionExternalId: String): Promise<Transaction>;
    save(transaction: Transaction): Promise<Transaction>;
    update(transactionExternalId: String, properties: object): Promise<Transaction>;
}