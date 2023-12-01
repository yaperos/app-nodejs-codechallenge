import { ReadFinancialTransactionDTO } from '@/transactions/dto/read-financial-transaction.dto';
import { FinancialTransaction } from '@/transactions/entities/financial-transaction.entity';

export class FinancialTransactionDTOBuilder {
  static fromEntity = (
    entity: FinancialTransaction,
  ): ReadFinancialTransactionDTO => {
    return {
      transactionExternalId: entity.transactionExternalId,
      transactionType: {
        name: entity.transactionType.transactionType,
      },
      transactionStatus: {
        name: entity.transactionStatus,
      },
      value: entity.value,
      createdAt: entity.createdAt,
    };
  };

  static fromEntities = (
    entities: FinancialTransaction[],
  ): ReadFinancialTransactionDTO[] => {
    return entities.map((entity) => {
      return this.fromEntity(entity);
    });
  };
}
