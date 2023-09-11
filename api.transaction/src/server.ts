import express, { Express } from 'express';
import { scopePerRequest, loadControllers } from 'awilix-express';

import { AppConfig } from './configuration';
import { Logger } from './common/types';
import { AwilixContainer } from 'awilix';

export default (container: AwilixContainer) => {
  const app: Express = express();

  const cfg = container.resolve<AppConfig>('config');
  const logger = container.resolve<Logger>('logger');

  app.use(express.json());
  app.use(scopePerRequest(container));
  app.use(loadControllers('controllers/*.controller.ts', { cwd: __dirname }));

  app.listen(cfg.PORT, () => {
    logger.info(`🚀 ${cfg.APP_NAME}: running at http://localhost:${cfg.PORT}`);
  });
};
