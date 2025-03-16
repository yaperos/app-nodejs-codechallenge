import { Transaction } from '../domain/Transaction';
import { ITransactionStatusPublisher } from '../domain/ITransactionStatusPublisher';
import { createLogger } from '../../config/log.config';

const LogService = createLogger('FRAUD');

export class AntiFraudService {
    constructor(private transactionStatusPublisher: ITransactionStatusPublisher) {}

    /* 
    * Evalua transacción en sistema Anti-Fraude
    */
    /* evaluateTransaction(transactionData: any): void {
        const transaction = new Transaction(transactionData.id, transactionData.value);

        const status = transaction.isApproved() ? 'approved' : 'rejected';

        // Enviar resultado al topic correspondiente
        this.transactionStatusPublisher.publish(transaction.id, status);

        LogService.info(`Transacción ${transaction.id} marcada como ${status.toUpperCase()}`);
    } */

    /**
     * Evalúa la transacción en el sistema Anti-Fraude
     */
    async evaluateTransaction(transactionData: any): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                // *1. Crea transacción*
                const transaction = this.createTransaction(transactionData);

                // *2. Evalua status de la Trx*
                const status = this.evaluateStatus(transaction);

                // *3. Publica evento con status actualizado*
                this.publishTransactionStatus(transaction, status);

                LogService.info(`Transacción ${transaction.id} marcada como ${status.toUpperCase()}`);
            
                resolve();
            } catch (error) {
                LogService.warn('Datos incompletos para evaluar Transacción');
                return reject(new Error('Datos incompletos'));
            }
        });

    }

    // Crea la transacción
    private createTransaction(transactionData: any): Transaction {
        if (!transactionData.id || typeof transactionData.value !== 'number') throw Error('Datos Incompletos');

        return new Transaction(transactionData.id, transactionData.value);
    }

    // Evalua transacción
    private evaluateStatus(transaction: Transaction): 'approved' | 'rejected' {
        return transaction.isApproved() ? 'approved' : 'rejected';
    }

    // Publica status de transacción a Kafka
    private async publishTransactionStatus(transaction: Transaction, status: 'approved' | 'rejected'): Promise<void> {
        this.transactionStatusPublisher.publish(transaction.id, status);
    }
}
