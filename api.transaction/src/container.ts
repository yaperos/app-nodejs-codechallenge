import { createContainer, asValue, InjectionMode, asClass } from 'awilix';

import { config } from './configuration';
import database from './database';

import { TransactionFindByIdQuery } from './services/queries/transaction-find-by-id.query';
import { TransactionRepository } from './services/repositories/transaction.repository';
import { TransactionCreateCommand } from './services/commands/transaction-create.command';

import { producer } from './kafka';
import { TransactionUpdateStatus } from './services/commands/transaction-update-status.command';

const container = createContainer({
  injectionMode: InjectionMode.CLASSIC,
});

export default async () => {
  container.register({
    config: asValue(config),
    logger: asValue(console),

    // services > queries
    transactionFindByIdQuery: asClass(TransactionFindByIdQuery),

    // services > commands
    transactionCreateCommand: asClass(TransactionCreateCommand),
    transactionUpdateStatus: asClass(TransactionUpdateStatus),

    // repositories
    transactionRepository: asClass(TransactionRepository),

    producer: asValue(producer),

    // db
    db: asValue(await database()),
  });

  return container;
};
