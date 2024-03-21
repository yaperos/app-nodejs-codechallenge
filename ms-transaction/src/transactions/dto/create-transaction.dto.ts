import { ApiProperty } from '@nestjs/swagger';
import { TransactionStatus } from '@prisma/client';

export class CreateTransactionDto {
  @ApiProperty()
  accountExternalIdDebit: string;

  @ApiProperty()
  accountExternalIdCredit: string;

  @ApiProperty()
  tranferTypeId: number;

  @ApiProperty()
  value: number;

  @ApiProperty()
  status?: TransactionStatus;
}
