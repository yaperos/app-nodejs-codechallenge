import { Transaction } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class TransactionEntity implements Transaction {
  @ApiProperty()
  id: number;
  
  @ApiProperty()
  accountExternalIdCredit: string;

  @ApiProperty()
  accountExternalIdDebit: string;

  @ApiProperty()
  transactionExternalId: string;
  
  @ApiProperty()
  value: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  transferTypeId: number;
  
  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}