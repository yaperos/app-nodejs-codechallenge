import { InMemoryTransactionRepo } from './inMemory/inMemoryTransactionRepo';

const transactionRepo = new InMemoryTransactionRepo();

export { transactionRepo };
