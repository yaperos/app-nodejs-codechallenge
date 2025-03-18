import { createConsumer } from './KafkaConfig';
import { AntiFraudService } from '../../application/AntiFraudService';
import { TransactionStatusProducer } from './TransactionStatusProducer';
import { createLogger } from '../logging/LogConfig';

const LogService = createLogger('FRAUD');

const transactionStatusPublisher = new TransactionStatusProducer();
const antiFraudService = new AntiFraudService(transactionStatusPublisher);

const consumer = createConsumer('transaction_created', 'anti-fraud-group');

consumer.on('message', async (message) => {
    const transactionData = JSON.parse(message.value.toString());

    LogService.info('Consumer recibió evento en Anti-Fraude:', transactionData);

    antiFraudService.evaluateTransaction(transactionData);
});

consumer.on('error', (err) => LogService.error('Consumer error de Kafka:', err));

LogService.info('Consumer de Anti-Fraude escuchando eventos...');
