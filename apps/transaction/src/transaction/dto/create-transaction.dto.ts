import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'Id of debit account',
    type: String,
    example: 'cbc722da-0dea-42c0-82a4-444a50ae7764',
  })
  accountExternalIdDebit: string;

  @ApiProperty({
    description: 'Id of credit account',
    type: String,
    example: '7205cf35-79cb-4a09-b477-82b71ff29a18',
  })
  accountExternalIdCredit: string;

  @ApiProperty({ description: 'Transaction value', type: Number, example: 120 })
  value: number;
}
