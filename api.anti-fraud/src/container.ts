import { createContainer, asValue, InjectionMode, asClass } from 'awilix';
import axios from 'axios';

import { config } from './configuration';
import { consumer } from './kafka';

import { TransactionProxy } from './proxies/transaction.proxy';

import { TransactionValidateCommand } from './services/transaction-validate.command';

const container = createContainer({
  injectionMode: InjectionMode.CLASSIC,
});

export default async () => {
  container.register({
    config: asValue(config),
    logger: asValue(console),

    // http client
    http: asValue(axios),

    // proxies
    transactionProxy: asClass(TransactionProxy),

    // commands
    transactionValidateCommand: asClass(TransactionValidateCommand),

    // kafka integration
    consumer: asValue(consumer),
  });

  return container;
};
