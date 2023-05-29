import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TransactionsCreateDto {
  @ApiProperty({
    type: String,
    description: 'Account external id debit',
    default: 'Guid',
  })
  @IsNotEmpty()
  @IsString()
  accountExternalIdDebit: string;

  @ApiProperty({
    type: String,
    description: 'Account external id credit',
    default: 'Guid',
  })
  @IsNotEmpty()
  @IsString()
  accountExternalIdCredit: string;

  @ApiProperty({
    type: String,
    description: 'Tranfer type id',
    default: '10',
  })
  @IsNotEmpty()
  @IsString()
  transferTypeId: string;

  @ApiProperty({
    type: Number,
    description: 'Value of the transaction',
    default: 500,
  })
  @IsNotEmpty()
  @IsNumber()
  value: number;
}
