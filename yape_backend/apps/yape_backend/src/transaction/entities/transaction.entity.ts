import { ApiProperty } from '@nestjs/swagger';
import { Transaction } from '@prisma/client';

export class TransactionEntity implements Transaction {
  @ApiProperty()
  id: string;

  @ApiProperty()
  accountExternalIdDebit: string;

  @ApiProperty()
  accountExternalIdCredit: string;

  @ApiProperty()
  transactionStatusId: number;

  @ApiProperty()
  tranferTypeId: number;

  @ApiProperty()
  value: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
