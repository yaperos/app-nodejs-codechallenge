import { TransactionEventService } from './TransactionEventService';

const eventService = new TransactionEventService();

// Servicio antifraude que delega la gestión de eventos a TransactionEventService
export async function startAntiFraudService() {
  await eventService.startConsumer();
}
