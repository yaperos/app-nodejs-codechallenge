import { transactionRepo } from '../../repositories';
import { GetTransactionExternal } from './GetTransactionExternal';
import { GetTransactionExternalController } from './GetTransactionExternalController';

const getTransactionExternalUseCase = new GetTransactionExternal(
  transactionRepo
);
const getTransactionExternalController = new GetTransactionExternalController(
  getTransactionExternalUseCase
);

export { getTransactionExternalUseCase, getTransactionExternalController };
