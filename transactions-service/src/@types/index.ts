import { TransactionController } from '../modules/transaction/transaction.controller';

type AppContext = {
  transactionController: TransactionController
}

const Symbols = {
  EventStreamer: Symbol.for('EventStreamer'),
};

export { AppContext, Symbols };
