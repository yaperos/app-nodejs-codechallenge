import { producer } from './KafkaConfig';
import { createLogger } from '../logging/LogConfig';

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
