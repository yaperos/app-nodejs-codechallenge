import { Transaction } from '../domain/Transaction';
import { ITransactionRepository } from '../domain/ITransactionRepository';
import { producer } from '../../config/kafka.config';

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

        const createdTransaction = await this.transactionRepository.create(transaction);

        // Enviar evento a Kafka
        producer.send(
            [{ topic: 'transaction_created', messages: JSON.stringify(createdTransaction) }],
            (err) => {
                if (err) console.error('Error al enviar evento a Kafka:', err);
            }
        );

        return createdTransaction;
    }

    async getTransactionById(id: string): Promise<Transaction | null> {
        return this.transactionRepository.getById(id);
    }
}
