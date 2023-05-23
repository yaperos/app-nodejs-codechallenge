import { Symbols } from '../../@types';
import { EventStreamer } from '../../config/event.streamer.interface';
import { appContainer } from '../../config/inversify.container';
import { TransactionController } from './transaction.controller';

// Get Event Streamer instance from container
const eventStreamer = appContainer.get<EventStreamer>(Symbols.EventStreamer);
// Get Transaction Controller instance from container
const transactionController = appContainer.get(TransactionController);

/**
 * Creates needed consumers for Transaction validation events
 */
const buildTransactionConsumers = async () => {
  // Create new consumer for created transactions
  await eventStreamer.createSubscription({ topic: 'transaction-created' }, (message) => {
    // Handle Transaction validation request
    transactionController.handleTransactionValidation(message.value?.toString() ?? '');
  });
};

export { buildTransactionConsumers };
