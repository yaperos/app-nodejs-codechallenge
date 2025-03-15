import { createConsumer } from '../../../config/kafka.config';
import { AntiFraudService } from '../../application/AntiFraudService';
import { TransactionStatusProducer } from './TransactionStatusProducer';

const transactionStatusPublisher = new TransactionStatusProducer();
const antiFraudService = new AntiFraudService(transactionStatusPublisher);

const consumer = createConsumer('transaction_created', 'anti-fraud-group');

consumer.on('message', async (message) => {
    const transactionData = JSON.parse(message.value.toString());

    console.log('Evento recibido en Anti-Fraude:', transactionData);

    antiFraudService.evaluateTransaction(transactionData);
});

consumer.on('error', (err) => console.error('Error en el Consumer de Kafka:', err));

console.log('Microservicio de Anti-Fraude escuchando eventos...');
