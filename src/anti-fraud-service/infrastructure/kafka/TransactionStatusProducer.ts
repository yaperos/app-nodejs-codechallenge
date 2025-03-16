import { producer } from '../../../config/kafka.config';
import { ITransactionStatusPublisher } from '../../domain/ITransactionStatusPublisher';
import { createLogger } from '../../../config/log.config';

const LogService = createLogger('FRAUD');

export class TransactionStatusProducer implements ITransactionStatusPublisher {
    publish(transactionId: string, status: 'approved' | 'rejected'): void {
        producer.send(
            [{ topic: 'transaction_status_updated', messages: JSON.stringify({ transactionId, status }) }],
            (err) => {
                if (err) LogService.warn(`Producer falló al enviar el resultado de la transacción ${transactionId}:`, err);
                else LogService.info(`Producer generó evento correctamente: Transacción ${transactionId} marcada como ${status.toUpperCase()}`);
                
            }
        );
    }
}
