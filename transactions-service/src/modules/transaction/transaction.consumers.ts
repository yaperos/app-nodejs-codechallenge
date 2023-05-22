import { TransactionStatus } from '@prisma/client';
import { Symbols } from '../../@types';
import { EventStreamer } from '../../config/event.streamer.interface';
import { appContainer } from '../../config/inversify.container';
import { TransactionController } from './transaction.controller';

const eventStreamer = appContainer.get<EventStreamer>(Symbols.EventStreamer);
const transactionController = appContainer.get(TransactionController);

const buildTransactionConsumers = async () => {
  await eventStreamer.createSubscription({ topic: 'transaction-approved' }, (message) => {
    transactionController.handleUpdateTransactionStatus(
      message.value?.toString() ?? '',
      TransactionStatus.APPROVED
    );
  });

  await eventStreamer.createSubscription({ topic: 'transaction-rejected' }, (message) => {
    transactionController.handleUpdateTransactionStatus(
      message.value?.toString() ?? '',
      TransactionStatus.REJECTED
    );
  });
};

export { buildTransactionConsumers };
