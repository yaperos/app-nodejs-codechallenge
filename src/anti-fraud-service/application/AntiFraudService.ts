import { Transaction } from '../domain/Transaction';
import { ITransactionStatusPublisher } from '../domain/ITransactionStatusPublisher';

export class AntiFraudService {
    constructor(private transactionStatusPublisher: ITransactionStatusPublisher) {}

    evaluateTransaction(transactionData: any): void {
        const transaction = new Transaction(transactionData.id, transactionData.value);

        const status = transaction.isApproved() ? 'approved' : 'rejected';

        // Enviar resultado al topic correspondiente
        this.transactionStatusPublisher.publish(transaction.id, status);

        console.log(`Transacción ${transaction.id} marcada como ${status.toUpperCase()}`);
    }
}
