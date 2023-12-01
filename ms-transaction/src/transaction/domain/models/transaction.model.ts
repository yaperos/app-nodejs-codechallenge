import { Expose, plainToClass, Exclude } from 'class-transformer';
import { v4 as uuid } from 'uuid';
import { TransactionStatus } from '../enums/transaction-status.enum';
import { TransactionTransferType } from '../enums/transaction-transfer-type.enum';
import { CreateTransactionDto } from '../../infrastructure/dtos/create-transaction.dto';
import { TransactionTransferTypeName } from '../enums/transaction-transfer-type.enum';
import { TransactionDescription } from '../interfaces/transaction-description.interface';

export class TransactionModel {
  @Expose()
  id: string;

  @Expose()
  accountExternalIdDebit: string;

  @Expose()
  accountExternalIdCredit: string;

  @Expose()
  transferTypeId: TransactionTransferType;

  @Expose()
  value: number;

  @Expose()
  status: TransactionStatus;

  @Expose()
  createdAt: Date;

  static createFromDto(dto: CreateTransactionDto): TransactionModel {
    return plainToClass(
      TransactionModel,
      {
        id: uuid(),
        accountExternalIdDebit: dto.accountExternalIdDebit,
        accountExternalIdCredit: dto.accountExternalIdCredit,
        transferTypeId: dto.tranferTypeId,
        value: dto.value,
        status: TransactionStatus.PENDING,
        createdAt: new Date(),
      },
      { excludeExtraneousValues: true },
    );
  }

  @Exclude()
  get transferTypeName(): TransactionTransferTypeName {
    if (this.transferTypeId === TransactionTransferType.DEBIT) {
      return TransactionTransferTypeName.DEBIT;
    }
    if (this.transferTypeId === TransactionTransferType.CREDIT) {
      return TransactionTransferTypeName.CREDIT;
    }
  }

  toDescriptionObject(): TransactionDescription {
    return {
      transactionExternalId: this.id,
      transactionType: {
        name: this.transferTypeName,
      },
      transactionStatus: {
        name: this.status,
      },
      value: this.value,
      createdAt: this.createdAt,
    };
  }
}
