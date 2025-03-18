import { createConsumer } from './KafkaConfig';
import { TransactionService } from '../../application/TransactionService';
import { TransactionRepository } from '../repository/TransactionRepository';
import { createLogger } from '../logging/LogConfig';

const LogService = createLogger('TRX');

const transactionRepository = new TransactionRepository();
const transactionService = new TransactionService(transactionRepository);

async function startConsumer() {
    const consumer = createConsumer('transaction_status_updated', 'transaction-update-group');

    consumer.on('message', async (message) => {
        const { transactionId, status } = JSON.parse(message.value.toString());

        LogService.info(`1. Consumer: Actualizando transacción ${transactionId} con estado ${status.toUpperCase()}`);

        const updatedTransaction = await transactionService.updateTransactionStatusByConsumer(transactionId, status);

        if (updatedTransaction) LogService.info(`2. Consumer: Actualizó transacción ${transactionId} como ${status.toUpperCase()}`);
    });

    consumer.on('error', async (err) => {
        LogService.error('Consumer con error de Kafka:', err);

        if (err.message.includes('The topic(s) transaction_status_updated do not exist')) {
            LogService.warn('El topic no existe. Esperando 5 segundos para reintentar...');
            await new Promise(resolve => setTimeout(resolve, 5000)); 
            startConsumer(); 
        }
    });
}

startConsumer();