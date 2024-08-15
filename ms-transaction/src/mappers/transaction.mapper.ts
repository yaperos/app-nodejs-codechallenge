import { Injectable } from '@nestjs/common';
import { TransactionDTO } from '../dtos/transaction.dto';
import { TransactionEntity } from '../entities/transaction.entity';

@Injectable()
export class TransactionMapper {
  dtoToEntity(dto: TransactionDTO): TransactionEntity {
    const transaction = new TransactionEntity();
    transaction.transactionExternalId = dto.transactionExternalId;
    transaction.accountExternalIdDebit = dto.accountExternalIdDebit;
    transaction.accountExternalIdCredit = dto.accountExternalIdCredit;
    transaction.tranferTypeId = dto.tranferTypeId;
    transaction.value = dto.value;
    transaction.status = dto.status;
    transaction.createdAt = dto.createdAt;
    transaction.updatedAt = dto.updatedAt;
    return transaction;
  }

  entityToDto(entity: TransactionEntity): TransactionDTO {
    const dto = new TransactionDTO();
    dto.transactionExternalId = entity.transactionExternalId;
    dto.accountExternalIdDebit = entity.accountExternalIdDebit;
    dto.accountExternalIdCredit = entity.accountExternalIdCredit;
    dto.tranferTypeId = entity.tranferTypeId;
    dto.value = entity.value;
    dto.status = entity.status;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }
}
