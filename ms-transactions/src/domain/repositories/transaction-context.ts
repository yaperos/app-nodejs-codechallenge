import { EntityManager } from 'typeorm';

export interface RepositoryTransactionContext {
  transactionManager?: EntityManager;
}
