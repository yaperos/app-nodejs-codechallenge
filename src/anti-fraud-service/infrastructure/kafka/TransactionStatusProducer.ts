import { producer } from '../../../config/kafka.config';
import { ITransactionStatusPublisher } from '../../domain/ITransactionStatusPublisher';

export class TransactionStatusProducer implements ITransactionStatusPublisher {
    publish(transactionId: string, status: 'approved' | 'rejected'): void {
        producer.send(
            [{ topic: 'transaction_status_updated', messages: JSON.stringify({ transactionId, status }) }],
            (err) => {
                if (err) {
                    console.error(`Error al enviar el resultado de la transacción ${transactionId}:`, err);
                } else {
                    console.log(`Resultado enviado: Transacción ${transactionId} marcada como ${status.toUpperCase()}`);
                }
            }
        );
    }
}
