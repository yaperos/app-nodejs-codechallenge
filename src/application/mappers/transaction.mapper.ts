import { TransactionEntity, CreateTransactionParams } from '@domain/entities/transaction.entity';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import { TransactionResponseDto } from '../dtos/transaction-response.dto';

export class TransactionMapper {
  static toCreateParams(dto: CreateTransactionDto): CreateTransactionParams {
    return {
      accountExternalIdDebit: dto.accountExternalIdDebit,
      accountExternalIdCredit: dto.accountExternalIdCredit,
      tranferTypeId: dto.tranferTypeId,
      value: dto.value,
    };
  }

  static toResponseDto(entity: TransactionEntity): TransactionResponseDto {
    return {
      transactionExternalId: entity.transactionExternalId,
      transactionType: {
        name: entity.transactionType.name,
      },
      transactionStatus: {
        name: entity.transactionStatus.name,
      },
      value: entity.value,
      createdAt: entity.createdAt,
    };
  }
} 