import { ProducerRecord } from "kafkajs";
import { TransactionDoc } from "../../infrastructure/entities/transaction-doc.entity";
import { Transaction } from "../transaction";

export interface TransactionRepository {
    save(transaction: Transaction): Promise<Transaction>
    getById(transactionId: string): Promise<Transaction>
    save_doc(transaction: TransactionDoc): Promise<any>
    getByIdDoc(transactionId: string): Promise<TransactionDoc>
    sentMessage(record: ProducerRecord): Promise<void>
}