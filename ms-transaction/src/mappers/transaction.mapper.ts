import { Injectable } from '@nestjs/common';
import { TransactionDTO } from '../dtos/transaction.dto';
import { TransactionEntity } from '../entities/transaction.entity';
import { TransactionStatus } from 'src/helper/contants';

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

  entityDomainToResponse(transaction: TransactionEntity) {
    return {
      transactionExternalId: transaction.transactionExternalId,
      transactionType: { name: transaction.tranferTypeId },
      transactionStatus: { name: TransactionStatus[transaction.status] },
      value: transaction.value,
      createdAt: transaction.createdAt,
    };
  }
}
