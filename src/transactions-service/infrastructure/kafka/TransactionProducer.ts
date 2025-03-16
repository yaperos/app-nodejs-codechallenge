import { producer } from '../../../config/kafka.config';
import { createLogger } from '../../../config/log.config';

const LogService = createLogger('TRX');

export const publishTransactionCreated = (transactionData: any) => {
    producer.send(
        [
            {
                topic: 'transaction_created', 
                messages: [JSON.stringify(transactionData)],
            }
        ],
        (err, data) => {
            if (err) LogService.warn(`Producer falló al enviar evento a Kafka:`, err);
            else LogService.info(`Producer generó evento correctamente al topic 'transaction_created':`, data);
        }
    );
};
