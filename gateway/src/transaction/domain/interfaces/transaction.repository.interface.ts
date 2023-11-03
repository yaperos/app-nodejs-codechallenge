import { DomainCreateTransactionDto } from '../dto/transaction.create.dto';

export interface TransactionRepositoryInterface {
  create(transaction: DomainCreateTransactionDto);
}
