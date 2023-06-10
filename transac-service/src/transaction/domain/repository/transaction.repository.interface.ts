import { TransactionEntityDto } from '../dtos/entities/transaction-entity.dto';

export abstract class TransactionRepositoryInterface {
  abstract create(
    transaction: TransactionEntityDto,
  ): Promise<TransactionEntityDto>;

  abstract findOne(externalId: string): Promise<TransactionEntityDto>;

  abstract updateById(id: string, data: unknown);
}
