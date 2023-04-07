import { transactionRepo } from '../../repositories';
import { CreateTransactionExternal } from './CreateTransactionExternal';
import { CreateTransactionExternalController } from './CreateTransactionExternalController';

const createTransactionExternal = new CreateTransactionExternal(
  transactionRepo
);
const createTransactionExternalController =
  new CreateTransactionExternalController(createTransactionExternal);

export { createTransactionExternal, createTransactionExternalController };
