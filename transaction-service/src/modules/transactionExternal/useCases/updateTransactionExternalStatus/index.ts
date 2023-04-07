import { transactionRepo } from '../../repositories';
import { UpdateTransactionExternalStatus } from './UpdateTransactionExternalStatus';

const updateTransactionExternalStatus = new UpdateTransactionExternalStatus(
  transactionRepo
);

export { updateTransactionExternalStatus };
