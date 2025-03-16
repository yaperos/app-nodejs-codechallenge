import { createConsumer } from '../../../config/kafka.config';
import { TransactionService } from '../../application/TransactionService';
import { TransactionRepository } from '../repository/TransactionRepository';

const transactionRepository = new TransactionRepository();
const transactionService = new TransactionService(transactionRepository);

const consumer = createConsumer('transaction_status_updated', 'transaction-update-group');

consumer.on('message', async (message) => {
    const { transactionId, status } = JSON.parse(message.value.toString());

    console.log(`Evento recibido: Actualizando transacción ${transactionId} con estado ${status.toUpperCase()}`);

    const updatedTransaction = await transactionService.updateTransactionStatus(transactionId, status);

    if (updatedTransaction) {
        console.log(`Transacción ${transactionId} actualizada como ${status.toUpperCase()}`);
    } else {
        console.error(`No se encontró la transacción ${transactionId} para actualizar.`);
  }
});

consumer.on('error', (err) => console.error('Error en el Consumer de Kafka:', err));

console.log('Servicio de Actualización de Transacciones escuchando eventos...');
