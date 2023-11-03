import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from '../dto/transaction.create.dto';
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
}
