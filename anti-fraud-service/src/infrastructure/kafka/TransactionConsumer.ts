import { createConsumer } from './KafkaConfig';
import { AntiFraudService } from '../../application/AntiFraudService';
import { TransactionStatusProducer } from './TransactionStatusProducer';
import { createLogger } from '../logging/LogConfig';

const LogService = createLogger('FRAUD');

const transactionStatusPublisher = new TransactionStatusProducer();
const antiFraudService = new AntiFraudService(transactionStatusPublisher);

async function startConsumer() {
    const consumer = createConsumer('transaction_created', 'anti-fraud-group');

    consumer.on('message', async (message) => {
        const transactionData = JSON.parse(message.value.toString());

        LogService.info('1. Consumer: Recibió evento en Anti-Fraude:', transactionData);

        antiFraudService.evaluateTransaction(transactionData);
    });

    consumer.on('error', async (err) => {
        LogService.error('Consumer error de Kafka:', err);

        if (err.message.includes('The topic(s) transaction_created do not exist')) {
            LogService.warn('El topic no existe. Esperando 5 segundos para reintentar...');
            await new Promise(resolve => setTimeout(resolve, 5000)); 
            startConsumer(); 
        }
    });
}

startConsumer();