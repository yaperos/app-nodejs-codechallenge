import { Transaction } from '../domain/Transaction';
import { ITransactionRepository } from '../domain/ITransactionRepository';
import { publishTransactionCreated } from '../infrastructure/kafka/TransactionProducer';

export class TransactionService {
    constructor(private transactionRepository: ITransactionRepository) {}

    async createTransaction(transactionData: any): Promise<Transaction> {
        const transaction = new Transaction(
            transactionData.id,
            transactionData.accountExternalIdDebit,
            transactionData.accountExternalIdCredit,
            transactionData.tranferTypeId,
            transactionData.value,
            'pending'
        );

        // Lógica de validación de montos en la capa de dominio
        transaction.validateAmount();  

        // Registra en BD 
        const createdTransaction = await this.transactionRepository.create(transaction);

        // Enviar evento a Kafka
        publishTransactionCreated(createdTransaction);

        return createdTransaction;
    }

    async getTransactionById(id: string): Promise<Transaction | null> {
        return this.transactionRepository.getById(id);
    }
}
