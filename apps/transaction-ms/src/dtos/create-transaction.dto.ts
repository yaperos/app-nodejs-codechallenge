import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

export class CreateTransactionDto {
  @IsUUID()
  @ApiProperty({
    description: 'The account external id that will be debited',
    example: 'dfbd291c-f56e-48cf-81fa-2cc6210731a7',
  })
  @IsNotEmpty()
  accountExternalIdDebit: string;

  @IsUUID()
  @ApiProperty({
    description: 'The account external id that will be credited',
    example: '6829c319-4a3b-4faa-b26f-b4484e016471',
  })
  @IsNotEmpty()
  accountExternalIdCredit: string;

  @IsInt()
  @ApiProperty({
    description: 'The transaction type id',
    example: 1,
  })
  @IsNotEmpty()
  transactionTypeId: number;

  @IsNumber()
  @ApiProperty({
    description: 'The value of the transaction',
    example: 100.0,
  })
  @IsNotEmpty()
  @Min(0.01)
  value: number;
}
