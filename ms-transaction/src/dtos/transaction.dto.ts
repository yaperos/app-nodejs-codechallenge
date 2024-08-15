import { ApiProperty } from '@nestjs/swagger';

export class TransactionDTO {
  transactionExternalId?: string;

  @ApiProperty()
  accountExternalIdDebit: string;

  @ApiProperty()
  accountExternalIdCredit: string;

  @ApiProperty()
  tranferTypeId: number;

  @ApiProperty()
  value: number;

  status: number;

  createdAt?: Date;

  updatedAt?: Date;
}
