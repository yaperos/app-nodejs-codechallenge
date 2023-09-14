import { EntityManager, EntityRepository } from 'typeorm';
import { BaseRepository } from './base-repository';
import { ITransactionRepository } from '../../domain/interfaces/transaction-repository';
import { Transaction } from '../../domain/entities/transaction';
import { TransactionEntity } from '../entities/transaction.entity';
import { AggregateRoot } from '../../domain/entities/aggregate-root';
import { MessageKafkaPayloadDto } from '../dtos/message-kafka-payload.dto';

@EntityRepository()
export class TransactionRepository
  extends BaseRepository
  implements ITransactionRepository
{
  constructor(private readonly manager: EntityManager) {
    super();
  }

  public async persist(entity: Transaction): Promise<AggregateRoot> {
    const transactionEntity = new TransactionEntity(entity);
    await this.manager.save<TransactionEntity>(transactionEntity);
    return entity;
  }

  public async findById(id: string): Promise<Transaction> {
    const entity = await this.manager.findOne(TransactionEntity, {
      where: [
        { id },
        { accountExternalIdDebit: id },
        { accountExternalIdCredit: id },
      ],
    });

    return entity && new Transaction().hydrate(entity);
  }

  public async findByaccountExternalIdDebit(
    accountExternalIdDebit: string,
  ): Promise<Transaction> {
    const entity = await this.manager.findOne(TransactionEntity, {
      where: {
        accountExternalIdDebit,
      },
    });
    return entity && new Transaction().hydrate(entity);
  }

  public async updateTransaction(
    params: MessageKafkaPayloadDto,
  ): Promise<Transaction> {
    await this.manager.update(
      TransactionEntity,
      { id: params.id },
      {
        status: params.status,
      },
    );
    return await this.findById(params.id);
  }
}
