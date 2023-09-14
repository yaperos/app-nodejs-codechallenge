import { Transaction } from '../entities/transaction';
import { IRepository } from './repository';
import { IMessageKafkaPayload } from './update-transactio';

export interface ITransactionRepository extends IRepository {
  findById(id: string): Promise<Transaction>;
  findByaccountExternalIdDebit(
    accountExternalIdDebit: string,
  ): Promise<Transaction>;
  updateTransaction(params: IMessageKafkaPayload): Promise<Transaction>;
}
