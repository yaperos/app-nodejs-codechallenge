import { TransactionEntity } from '.././../../domain/entities/transaction.entity';

export class RetrieveTransactionResponse {
  static toResponse(entity: TransactionEntity) {
    return {
      transactionExternalId: entity.transactionExternalId,
      transactionType: {
        name: entity.transferType.name,
      },
      transactionStatus: {
        name: entity.transactionStatus,
      },
      value: entity.value,
      createdAt: entity.createdAt,
    };
  }
}
