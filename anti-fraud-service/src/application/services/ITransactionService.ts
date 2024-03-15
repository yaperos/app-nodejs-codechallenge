import { TransactionDTO } from '../dto/TransactionDTO';

export abstract class ITransactionService {
  abstract evaluateTransaction(transaction: TransactionDTO): Promise<void>;
}
