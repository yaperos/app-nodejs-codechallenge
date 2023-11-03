import { DomainCreateTransactionDto } from '../dto/transaction.create.dto';

export interface TransactionServiceInterface {
  create(transaction: DomainCreateTransactionDto);
}
