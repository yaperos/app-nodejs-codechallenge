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

    async updateTransactionStatus(transactionId: string, status: 'approved' | 'rejected'): Promise<Transaction | null> {
        const transaction = await this.getTransactionById(transactionId);

        if (!transaction) {
            console.error(`No se encontró la transacción ${transactionId} para actualizar.`);
            return null;
        }

        if (status === 'approved') transaction.approve();  
        else transaction.reject();   

        const updatedTransaction = await this.transactionRepository.updateTransactionStatus(transaction);

        if (updatedTransaction) console.log(`Transacción ${transactionId} actualizada como ${status.toUpperCase()}`);
        else console.error(`No se pudo actualizar la transacción ${transactionId}`);

        return updatedTransaction;
    }

}
