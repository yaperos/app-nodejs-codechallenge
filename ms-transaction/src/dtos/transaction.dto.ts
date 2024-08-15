import { ApiProperty } from '@nestjs/swagger';

export class TransactionDTO {
  @ApiProperty()
  transactionExternalId?: string;

  @ApiProperty()
  accountExternalIdDebit: string;

  @ApiProperty()
  accountExternalIdCredit: string;

  @ApiProperty()
  tranferTypeId: number;

  @ApiProperty()
  value: number;

  @ApiProperty()
  status: number;

  @ApiProperty()
  createdAt?: Date;

  @ApiProperty()
  updatedAt?: Date;
}
