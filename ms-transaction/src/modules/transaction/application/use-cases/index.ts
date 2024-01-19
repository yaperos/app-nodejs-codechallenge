import { TransactionApprovedHandler } from './transaction-approved-handler.use-case';
import { TransactionCreator } from './transaction-creator.use-case';
import { TransactionFinder } from './transaction-finder.use-case';
import { TransactionRejectedHandler } from './transaction-rejected-handler.use-case';
import { TransactionsPaginator } from './transactions-paginator.use-case';

export const UseCases = [
  TransactionApprovedHandler,
  TransactionCreator,
  TransactionFinder,
  TransactionRejectedHandler,
  TransactionsPaginator,
];
