import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from '../../infrastructure/dto/transaction.create.dto';
import { TransactionDto } from '../../infrastructure/dto/transaction.dto';
import { Transaction } from 'src/transaction/domain/entities/transaction.type';
import { DomainCreateTransactionDto } from 'src/transaction/domain/dto/transaction.create.dto';

@Injectable()
export class TransactionMapper {
  toDomainCreate(
    createUserDto: CreateTransactionDto,
  ): DomainCreateTransactionDto {
    const {
      accountExternalIdDebit,
      accountExternalIdCredit,
      tranferTypeId,
      value,
    } = createUserDto;
    return {
      accountExternalIdDebit,
      accountExternalIdCredit,
      tranferTypeId,
      value,
    };
  }

  toDto(transaction: Transaction): TransactionDto {
    const {
      id,
      accountExternalIdDebit,
      tranferTypeId,
      value,
      status,
      createdAt,
    } = transaction;
    return {
      id,
      transactionExternalId: accountExternalIdDebit,
      transactionType: {
        name: tranferTypeId + '',
      },
      transactionStatus: {
        name: status,
      },
      value,
      createdAt,
    };
  }
}
