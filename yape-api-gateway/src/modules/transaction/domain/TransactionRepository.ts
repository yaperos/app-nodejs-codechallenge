import { IFindManyPaginated } from 'src/Shared/domain/interfaces/repository.interface';
import { Transaction, TransactionProps } from './Transaction';
import { IPageInfo } from 'src/Shared/adapters/interfaces/PageInfo';

export interface FindTransactionsQuery
  extends IFindManyPaginated<TransactionProps> {}

export interface TransactionRepository {
  create(data: Transaction): Promise<Transaction>;
  save(data: Transaction): Promise<Transaction>;
  findById(id: number): Promise<Transaction>;
  findManyPaginated(
    query: FindTransactionsQuery,
  ): Promise<IPageInfo<Transaction>>;
}
