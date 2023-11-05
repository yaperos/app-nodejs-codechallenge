import { Injectable } from '@nestjs/common';
import { Transaction } from 'src/transaction/domain/entities/transaction.type';
import { StatusesEnum } from 'src/transaction/domain/enum/transaction.statuses';
import { DomainCreateTransactionDto } from 'src/transaction/domain/dto/transaction.create.dto';
import { TransactionCreateInput } from 'src/transaction/infrastructure/dto/transaction.create.input';

@Injectable()
export class TransactionMapper {
  toDomainCreate(
    createUserDto: TransactionCreateInput,
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
      status: StatusesEnum.PENDING,
    };
  }

  toDto(transaction: Transaction) {
    const {
      id,
      accountExternalIdDebit,
      accountExternalIdCredit,
      tranferTypeId,
      value,
      status,
      createdAt,
    } = transaction;
    return {
      id,
      accountExternalIdDebit,
      accountExternalIdCredit,
      tranferTypeId,
      value,
      status,
      createdAt,
    };
  }
}
