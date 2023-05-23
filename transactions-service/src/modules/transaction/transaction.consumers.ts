import { TransactionStatus } from '@prisma/client';
import { Symbols } from '../../@types';
import { EventStreamer } from '../../config/event.streamer.interface';
import { appContainer } from '../../config/inversify.container';
import { TransactionController } from './transaction.controller';

// Get Event Streamer instance from container
const eventStreamer = appContainer.get<EventStreamer>(Symbols.EventStreamer);
// Get Transaction Controller instance from container
const transactionController = appContainer.get(TransactionController);

/**
 * Creates needed consumers for Transaction update events
 */
const buildTransactionConsumers = async () => {
  // Create new consumer for approved transactions
  await eventStreamer.createSubscription({ topic: 'transaction-approved' }, (message) => {
    // Handle Transaction status update request
    transactionController.handleUpdateTransactionStatus(
      message.value?.toString() ?? '',
      TransactionStatus.APPROVED
    );
  });

  // Create new consumer for rejected transactions
  await eventStreamer.createSubscription({ topic: 'transaction-rejected' }, (message) => {
    // Handle Transaction status update request
    transactionController.handleUpdateTransactionStatus(
      message.value?.toString() ?? '',
      TransactionStatus.REJECTED
    );
  });
};

export { buildTransactionConsumers };
