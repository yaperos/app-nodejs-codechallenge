import { TransactionDTO } from '../dto/TransactionDTO';

export abstract class ITransactionService {
  abstract createTransaction(transaction: TransactionDTO): Promise<void>;
}
