import { Transaction } from '../domain/Transaction';
import { ITransactionRepository } from '../domain/ITransactionRepository';
import { publishTransactionCreated } from '../infrastructure/kafka/TransactionProducer';
import { DatabaseError, NotFoundError } from '../infrastructure/middlewares/errorMiddleware';
import { LogService } from '../infrastructure/log/LogService';

export class TransactionService {
    constructor(private transactionRepository: ITransactionRepository) {}

    /* 
    * Crear transacción
    */
    async createTransaction(transactionData: any): Promise<Transaction> {
        // *1. Genera Transaction*
        const transaction = this.buildTransaction(transactionData);

        // *2. Valida un monto valido (Valor positivo)*
        this.validateTransaction(transaction);

        // *3. Guarda en DB*
        const createdTransaction = await this.saveTransaction(transaction);

        // *4. Pública topic de Transacción generada*
        await this.publishEvent(createdTransaction);

        return createdTransaction;
    }

    // Construcción del objeto de dominio
    private buildTransaction(transactionData: any): Transaction {
        return new Transaction(
            transactionData.id,
            transactionData.accountExternalIdDebit,
            transactionData.accountExternalIdCredit,
            transactionData.tranferTypeId,
            transactionData.value,
            'pending'
        );
    }

    // Validación de reglas del negocio
    private validateTransaction(transaction: Transaction): void {
        transaction.validateAmount();
    }

    // Guardar en la base de datos con manejo de errores
    private async saveTransaction(transaction: Transaction): Promise<Transaction> {
        try {
            const createdTransaction = await this.transactionRepository.create(transaction);
    
            if (!createdTransaction) throw new DatabaseError(`La transacción no se creó correctamente en la base de datos.`);
    
            return createdTransaction;
        } catch (error) {
            throw new DatabaseError(`Error al guardar la transacción en la base de datos: ${error}`);
        }
    }

    // Publicar evento en Kafka con manejo de errores
    private async publishEvent(transaction: Transaction): Promise<void> {
        publishTransactionCreated(transaction);
    }

    /* 
    * Obtener Transacción
    */
    async getTransactionById(id: string): Promise<Transaction> {    
        return this.validateTransactionOnDB(id);
    }

    // Valida que exista Transacción en DB
    private async validateTransactionOnDB(id: string): Promise<Transaction> {
        try {
            const transaction = await this.transactionRepository.getById(id);
    
            if (!transaction) throw new DatabaseError(`La transacción con ID ${id} no fue encontrada.`);
    
            return transaction;
        } catch (error) {
            throw new DatabaseError(`Error al consultar la transacción en la base de datos: ${error}`);
        }
    }
    
    /* 
    * Actualizar status de Transacción
    */
    async updateTransactionStatusByConsumer(transactionId: string, status: 'approved' | 'rejected'): Promise<Transaction | undefined> {
        try {
            // *1. Obtiene transacción*
            const transaction = await this.getTransactionById(transactionId);

            // *2. Actualiza estado local según reglas del negocio*
            this.updateStatus(transaction, status)

            // *Actualiza estado de Transacción en DB*
            return this.updatedStatusTransaction(transaction);    
        } catch (error) {
            LogService.warn(`No se logró actualizar el estado by Consumer: ${error}`)
        }
        
    }

    // Actualiza status según reglas del negocio
    private updateStatus(transaction: Transaction, status: 'approved' | 'rejected'): void {
        if (status === 'approved') return transaction.approve();  
        
        return transaction.reject();   
    }

    // Actualiza transacción en la BD
    private async updatedStatusTransaction(transaction: Transaction): Promise<Transaction> {
        try {
            const updatedTransaction = await this.transactionRepository.updateTransactionStatus(transaction);
    
            if (!updatedTransaction) throw new DatabaseError(`La transacción no se actualizó correctamente en la base de datos.`);
    
            return updatedTransaction;
        } catch (error) {
            throw new DatabaseError(`Error al actualizar la transacción en la base de datos: ${error}`);
        }
    }

}
