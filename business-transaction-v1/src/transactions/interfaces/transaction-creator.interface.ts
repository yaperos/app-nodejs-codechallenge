import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { TransactionResponseDto } from '../dto/transaction-response.dto';

/**
 * Interface for transaction creation operations
 * Segregated responsibility: Only handles transaction creation
 */
export interface ITransactionCreator {
  createTrx(request: CreateTransactionDto): Promise<TransactionResponseDto>;
}
