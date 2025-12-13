import { startConsumer } from '../kafka/client/consumer';
import { sendStatusEvent } from '../kafka/client/producer';
import { TransactionCreatedEvent, TransactionStatusEvent } from '../messages/transactionMessages';
import { TransactionStatusName } from '../enum/TransactionStatusName';

const limitValue = 1000;

// Servicio encargado de manejar eventos de transacción (consumer y producer)
export class TransactionEventService {
  // Procesa el evento recibido y emite el evento de estado
  async processTransaction(event: TransactionCreatedEvent) {
    const status = event.value > limitValue ? TransactionStatusName.Rejected : TransactionStatusName.Approved;
    await this.sendStatusEvent({
      transactionExternalId: event.transactionExternalId,
      status: status
    });
    console.log(`Anti-Fraud: ${event.transactionExternalId} -> ${status}`);
  }

  // Inicia el consumer y escucha eventos
  async startConsumer() {
    await startConsumer(this.processTransaction.bind(this));
    console.log('Anti-Fraud Service listening for transactions...');
  }

  // Envía evento de estado (puede ser usado por otros servicios si se requiere)
  async sendStatusEvent(event: TransactionStatusEvent) {
    await sendStatusEvent(event);
  }
}
