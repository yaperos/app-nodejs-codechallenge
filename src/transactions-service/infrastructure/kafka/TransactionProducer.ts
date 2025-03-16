import { producer } from '../../../config/kafka.config';
import { LogService } from '../log/LogService';

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
