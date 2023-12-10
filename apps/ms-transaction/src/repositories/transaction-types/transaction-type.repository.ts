import { InjectEntityManager } from '@nestjs/typeorm';
import { TransactionType, TransactionTypeSchema } from '@app/common';
import { TransactionTypeRepositoryContract } from './transaction-type.repository.contract';
import { EntityManager, Repository } from 'typeorm';

export class TransactionTypeRepository
  implements TransactionTypeRepositoryContract
{
  private readonly repository: Repository<TransactionType>;

  constructor(@InjectEntityManager() private readonly manager: EntityManager) {
    this.repository = this.manager.getRepository(TransactionTypeSchema);
  }

  async findById(id: number): Promise<TransactionType> {
    return this.repository.findOneBy({ id });
  }
}
