import { TransactionController } from '../modules/transaction/transaction.controller';

/**
 * Context of the Apollo Server application
 * @property {TransactionController} Controller Transactions controller
 */
type AppContext = {
  transactionController: TransactionController
}

/**
 * Defined symbols to map instances with dependency injection
 */
const Symbols = {
  EventStreamer: Symbol.for('EventStreamer'),
};

export { AppContext, Symbols };
