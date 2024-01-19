import { ObjectNotFoundError } from 'src/modules/shared/domain/errors';

export class TransactionNotFoundError extends ObjectNotFoundError {
  protected readonly objectName = 'Transaction';
}
