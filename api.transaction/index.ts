import { Logger } from './src/common/types';

// initialize project container
import containerInitializer from './src/container';

// start server
import server from './src/server';

(async () => {
  const container = await containerInitializer();
  const logger = container.resolve<Logger>('logger');

  logger.info('🕒 Starting project');

  server(container);
})();
