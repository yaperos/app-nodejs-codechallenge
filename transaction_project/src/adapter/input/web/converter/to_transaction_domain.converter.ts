import { Injectable } from '@nestjs/common';
import { TransactionEntity } from 'src/domain/models/transaction.entity';
import { TransactionCreationRequestDto } from '../dto/transaction_creation.request.dto';

@Injectable()
export class ToTransactionDomainConverter {
  convert(dto: TransactionCreationRequestDto): TransactionEntity {
    const entity = new TransactionEntity();
    entity.accountExternalIdCredit = dto.accountExternalIdCredit;
    entity.accountExternalIdDebit = dto.accountExternalIdDebit;
    entity.value = dto.value;
    entity.transferTypeId = dto.transferTypeId;
    return entity;
  }
}
