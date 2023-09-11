import { Consumer } from 'kafkajs';

import containerInitializer from './src/container';
import { Logger } from './src/common/types';
import { AppTopic } from './src/common/topics';
import { AppConfig } from './src/configuration';
import { TransactionValidateCommand } from './src/services/transaction-validate.command';

try {
  (async () => {
    const container = await containerInitializer();

    const cfg = container.resolve<AppConfig>('config');
    const logger = container.resolve<Logger>('logger');

    logger.info('🕒 Starting project');

    const consumer = container.resolve<Consumer>('consumer');

    // Consuming
    await consumer.connect();
    await consumer.subscribe({
      topic: AppTopic.VALIDATE_TRANSACTION,
      fromBeginning: true,
    });

    const transactionValidateCommand =
      container.resolve<TransactionValidateCommand>(
        'transactionValidateCommand',
      );

    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        if (!message || !message.value) {
          return;
        }

        logger.info(`${topic}: Resolving a new message`);

        switch (topic as AppTopic) {
          case AppTopic.VALIDATE_TRANSACTION:
            transactionValidateCommand.handle(message.value?.toString());
            break;
          default:
            logger.warn('Unsupported topic has been supplied');
            break;
        }
      },
    });

    logger.info(`🚀 ${cfg.APP_NAME}: running as listener`);
  })();
} catch (error) {
  console.error(error);
}
