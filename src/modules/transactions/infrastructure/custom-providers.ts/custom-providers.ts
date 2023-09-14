import { TRANSACTION_REPOSITORY } from '../constants/injection-tokens';
import { TransactionRepository } from '../repositories/transaction-repository';

export const transactionRepository = {
  provide: TRANSACTION_REPOSITORY,
  useClass: TransactionRepository,
};
