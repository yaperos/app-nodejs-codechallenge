import { DatabaseService } from '../../application/database.usecase';
import { CacheDatabaseInterface } from '../../domain/interfaces/cacheDatabase.interface';
import { TransactionType } from '../../domain/types/transaction.interface';

export class DatabaseImplementation implements CacheDatabaseInterface {
    async process(transaction: TransactionType): Promise<any> {
      return new DatabaseService().process(transaction)
    }
}