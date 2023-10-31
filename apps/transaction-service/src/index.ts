import { logger } from './infrastructure/di';
import { closeConnections } from './infrastructure/event-handlers';
import { initEventWatcher } from './infrastructure/event-watcher';
import {
  initDatabase,
  initKafka,
  initServer,
} from './infrastructure/initialization';

const main = async () => {
  try {
    await initDatabase();
    initKafka();
    initEventWatcher();

    await initServer();
  } catch (error) {
    logger.error('ERROR', error);
    process.exit(1);
  }
};

main();

process.on('SIGINT', closeConnections);
process.on('SIGTERM', closeConnections);
