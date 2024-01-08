import { Exclude, Expose, Transform } from 'class-transformer';
import { TransactionStatusEnum, TransferTypeEnum } from 'src/utils/constants';

export class TransactionModel {
  @Expose()
  transactionExternalId: string;

  @Exclude()
  accountExternalIdDebit: string;

  @Exclude()
  accountExternalIdCredit: string;

  @Expose({ name: 'transferTypeId' })
  @Transform(({ value }) => {
    return { name: TransferTypeEnum[value] };
  })
  transactionType: { name: string };

  @Expose({ name: 'transactionStatusId' })
  @Transform(({ value }) => {
    return { name: TransactionStatusEnum[value] };
  })
  transactionStatus: { name: string };

  @Expose()
  value: number;

  @Expose()
  createdAt: Date;

  @Exclude()
  modifiedAt: Date;
}
