import { DebeziumTransactionPayload } from '../controllers/validation.controller';
import { TransactionStatus } from '../enums/transaction-status.enum';

interface TransactionTypeInfo {
  name: string;
}

interface TransactionStatusInfo {
  name: TransactionStatus;
}

export class GetTransactionDto {
  transactionExternalId: string;
  transactionType: TransactionTypeInfo;
  transactionStatus: TransactionStatusInfo;
  value: number;
  createdAt: Date;

  static fromEntity(entity: DebeziumTransactionPayload): GetTransactionDto {
    const dto = new GetTransactionDto();
    dto.transactionExternalId = entity.transactionExternalId;
    dto.transactionType = { name: `Type ${entity.transferTypeId}` };
    dto.transactionStatus = { name: entity.status };
    dto.value = Number(entity.value)
    dto.createdAt = entity.createdAt;
    return dto;
  }
}