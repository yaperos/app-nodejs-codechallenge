import { GetTransactionResponseDto } from '../dto/get-transaction-response.dto';
import { Transaction } from '../transaction.entity';

/**
 * Interface for transaction retrieval operations
 * Segregated responsibility: Only handles transaction queries
 */
export interface ITransactionReader {
  findAll(): Promise<GetTransactionResponseDto[]>;
  findOne(id: string): Promise<GetTransactionResponseDto>;
}
