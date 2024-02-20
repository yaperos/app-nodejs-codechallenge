import { Repository } from 'typeorm';
import { TransactionModel, TransactionStatus } from '../../../domain/transaction.model';
import { databaseConnection } from '../connection';
import { TransactionEntity } from '../transaction.entity';
import { TransactionMapper } from './transaction.mapper';

export class TransactionRepository {
  private repository: Repository<TransactionEntity>;
  private mapper: TransactionMapper;

  constructor() {
    this.repository = databaseConnection.getRepository(TransactionEntity);
    this.mapper = new TransactionMapper();
  }

  async findOneById(id: string): Promise<TransactionModel> {
    const transactionPersistence = await this.repository.findOne({
      where: { id },
    });

    if (transactionPersistence == null || transactionPersistence == undefined) {
      return null;
    }

    return this.mapper.toDomain(transactionPersistence);
  }

  async insert(data: TransactionModel): Promise<void> {
    const transactionPersistence = this.mapper.toPersistence(data);
    await this.repository.save(transactionPersistence);
  }

  async updateStatus(id: string, status: TransactionStatus): Promise<void> {
    await this.repository.update(
      {
        id,
      },
      {
        status,
      },
    );
  }
}
