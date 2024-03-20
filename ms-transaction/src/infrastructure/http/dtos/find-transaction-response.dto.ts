import { ApiProperty } from '@nestjs/swagger';
import {
  TransferStatus,
  TransferType,
} from 'src/domain/interfaces/transaction.interface';

export class TransactionPresenter {
  @ApiProperty()
  amount: number;

  @ApiProperty()
  externalId: string;

  @ApiProperty()
  transferTypeName: TransferType;

  @ApiProperty()
  status: TransferStatus;

  @ApiProperty()
  createdAt: Date;

  constructor(partial: Partial<TransactionPresenter>) {
    this.amount = partial.amount;
    this.externalId = partial.externalId;
    this.transferTypeName = partial.transferTypeName;
    this.status = partial.status;
    this.createdAt = partial.createdAt;
  }
}
