import { TransactionVerifyRequest } from 'src/module/domain/entities/transaction-verify-request';
import { TransactionVerifyEntity } from '../entities/transaction-verify.entity';
import {
  TransactionStatus,
  TransactionTypes,
} from 'src/core/helpers/constants';
import {
  TransactionVerify,
  TransactionVerifyStatus,
  TransactionVerifyType,
} from 'src/module/domain/aggregates/transaction-verify';

export class TransactionVerifyDto {
  static fromDomainToEntity(
    transactionVerifyRequest: TransactionVerifyRequest,
  ): TransactionVerifyEntity {
    const transactionVerifyEntity = new TransactionVerifyEntity();
    transactionVerifyEntity.accountExternalIdCredit =
      transactionVerifyRequest.accountExternalIdCredit;
    transactionVerifyEntity.accountExternalIdDebit =
      transactionVerifyRequest.accountExternalIdDebit;
    transactionVerifyEntity.transactionType = {
      id: transactionVerifyRequest.transferTypeId,
      name: TransactionTypes[transactionVerifyRequest.transferTypeId],
    };
    transactionVerifyEntity.transactionStatus = {
      id: 1,
      name: TransactionStatus[1],
    };
    transactionVerifyEntity.value = transactionVerifyRequest.value;
    return transactionVerifyEntity;
  }

  static fromDataToDomain(
    transactionVerifySaved: TransactionVerifyEntity,
  ): TransactionVerify {
    const transactionVeritySavedType = new TransactionVerifyType(
      transactionVerifySaved.transactionType.id,
      transactionVerifySaved.transactionType.name,
    );
    const transactionVerifySavedStatus = new TransactionVerifyStatus(
      transactionVerifySaved.transactionStatus.id,
      transactionVerifySaved.transactionStatus.name,
    );
    return new TransactionVerify(
      transactionVerifySaved.transactionExternalId,
      transactionVerifySaved.accountExternalIdDebit,
      transactionVerifySaved.accountExternalIdCredit,
      transactionVeritySavedType,
      transactionVerifySaved.value,
      transactionVerifySavedStatus,
      transactionVerifySaved.createdAt,
      transactionVerifySaved.updatedAtStatus,
    );
  }
}
