
import { TransactionCreatedEvent } from '../messages/transactionMessages';
import { sendTransactionCreatedEvent } from '../kafka/client/producer';
import { TransactionService } from './TransactionService';
import { TransactionStatusName } from '../enum/TransactionStatusName';
/**
 * Servicio encargado de manejar los eventos relacionados a transacciones,
 * Emite eventos a Kafka y consumir eventos para actualizar el estado de las transacciones.
 */
export class TransactionEventService {
  
  /**
   * Envía un evento de transacción creada a Kafka
   */
  async emitTransactionCreated(event: TransactionCreatedEvent) {
    await sendTransactionCreatedEvent(event);
  }

  /**
   * Consume un evento de actualización de estado de transacción
   */
  async consumeTransactionEvent(event: { transactionExternalId: string; status: TransactionStatusName }) {
    const transactionService = new TransactionService();
    await transactionService.updateTransactionStatus(event.transactionExternalId, event.status);
  }
}