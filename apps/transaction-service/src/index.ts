import { logger } from './infrastructure/di';
import {
  initDatabase,
  initKafka,
  initServer,
} from './infrastructure/initialization';

const main = async () => {
  try {
    await initDatabase();
    await initKafka();

    await initServer();
  } catch (error) {
    logger.error('ERROR', error);
    process.exit(1);
  }
};

main();
