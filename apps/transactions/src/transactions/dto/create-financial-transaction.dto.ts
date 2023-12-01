import { ApiProperty } from '@nestjs/swagger';

export class CreateFinancialTransactionDTO {
  @ApiProperty({
    description: 'GUID with the account external debit ID',
  })
  accountExternalIdDebit: string;

  @ApiProperty({
    description: 'GUID with the account external debit ID',
  })
  @ApiProperty()
  accountExternalIdCredit: string;

  @ApiProperty({
    description: '1 For Yape, 2 for Plin',
  })
  @ApiProperty()
  tranferTypeId: number;

  @ApiProperty({
    description: 'Ammount to be transfered',
  })
  @ApiProperty()
  value: number;
}
