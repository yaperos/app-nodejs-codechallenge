import { Injectable } from '@nestjs/common';
import { Transaction } from '../../domain/entities/transaction';
import { TransactionResponseDto } from '../../domain/dto/transaction-response.dto';

@Injectable()
export class TransactionMapper {
  toResponseDto(transaction: Transaction): TransactionResponseDto {
    return {
      transactionExternalId: transaction.id,
      transactionType: {
        name: transaction.transferType,
      },
      transactionStatus: {
        name: transaction.status,
      },
      value: transaction.value.toNumber(),
      createdAt: transaction.createdAt,
    };
  }
}
