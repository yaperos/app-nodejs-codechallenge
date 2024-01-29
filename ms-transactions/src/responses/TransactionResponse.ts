import { TransactionResponseInterface } from './TransactionResponse.interface';
import { TransactionEntity } from '../database/entities/TransactionEntity';

export class TransactionResponse implements TransactionResponseInterface {
  transactionExternalId: string | undefined;
  transactionStatus: { name: string };
  transactionType: { name: string };
  value: number;
  createdAt: Date | undefined;

  constructor(
    transactionExternalId: string | undefined,
    transactionStatus: string,
    transactionType: string,
    value: number,
    createdAt: Date | undefined
  ) {
    this.transactionExternalId = transactionExternalId;
    this.transactionStatus = {
      name: transactionStatus
    };
    this.transactionType = { name: transactionType };
    this.value = value;
    this.createdAt = createdAt;
  }

  static fromEntity(entity: TransactionEntity) {
    return new TransactionResponse(
      entity.transactionExternalId,
      entity.transactionStatus.name,
      entity.transactionType.name,
      entity.value,
      entity.createdAt
    );
  }
}
