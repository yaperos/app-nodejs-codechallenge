import { Transactions } from 'src/adapters/database/mongo/transactions/transactions.schema';
import { TransactionsDto } from '../../../modules/transactions/dto/transactions.dto';
import { TransactionsUpdateDto } from 'src/modules/transactions/dto';

export interface ITransactionsRepository {
  create(transactionsDto: TransactionsDto): Promise<Transactions | null>;
  update(
    transactionExternalId: string,
    transactionsDto: TransactionsUpdateDto,
  ): Promise<Transactions | null>;
  getTransactionById(transactionExternalId: string): Promise<Transactions>;
  getAll(): Promise<Transactions[]>;
}
