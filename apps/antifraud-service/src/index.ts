import { logger } from './infrastructure/di';
import {
  closeConnections,
  initProducer,
} from './infrastructure/event-handlers';
import { initEventWatcher } from './infrastructure/event-listener';

const main = async () => {
  try {
    initProducer();
    initEventWatcher();
  } catch (error) {
    logger.error('ERROR', error);
    process.exit(1);
  }
};

main();

process.on('SIGINT', closeConnections);
process.on('SIGTERM', closeConnections);
