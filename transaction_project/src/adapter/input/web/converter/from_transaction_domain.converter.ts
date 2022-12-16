import { Injectable } from '@nestjs/common';
import { TransactionEntity } from 'src/domain/models/transaction.entity';
import { TransactionStatus } from 'src/domain/models/transaction_status.enum';
import { TransactionTypeEnum } from 'src/domain/models/transaction_type_enum';
import { TransactionQueryResponsetDto } from '../dto/transaction_query.response.dto';

@Injectable()
export class FromTransactionDomainConverter {
  toTransactionQueryResponseDto(
    domainEntity: TransactionEntity,
  ): TransactionQueryResponsetDto {
    const dto = new TransactionQueryResponsetDto();
    dto.transactionExternalId = domainEntity.transactionExternalId;
    dto.transactionType = {
      name: TransactionTypeEnum[domainEntity.transferTypeId],
    };
    dto.transactionStatus = {
      name: TransactionStatus[domainEntity.status],
    };
    dto.value = domainEntity.value;
    dto.createdAt = domainEntity.createAt;
    return dto;
  }
}
