import { createConsumer } from '../../../config/kafka.config';
import { TransactionService } from '../../application/TransactionService';
import { TransactionRepository } from '../repository/TransactionRepository';
import { createLogger } from '../../../config/LogService';

const LogService = createLogger('TRX');

const transactionRepository = new TransactionRepository();
const transactionService = new TransactionService(transactionRepository);

const consumer = createConsumer('transaction_status_updated', 'transaction-update-group');

consumer.on('message', async (message) => {
    const { transactionId, status } = JSON.parse(message.value.toString());

    LogService.info(`Consumer: Actualizando transacción ${transactionId} con estado ${status.toUpperCase()}`);

    const updatedTransaction = await transactionService.updateTransactionStatusByConsumer(transactionId, status);

    if (updatedTransaction) LogService.info(`Consumer actualizó transacción ${transactionId} actualizada como ${status.toUpperCase()}`);
  
});

consumer.on('error', (err) => LogService.error('Consumer con error de Kafka:', err));

LogService.info('Consumer de Actualización de Transacciones escuchando eventos...');
