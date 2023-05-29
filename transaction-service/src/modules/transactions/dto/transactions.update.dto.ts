import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsObject,
  IsOptional,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';

export class TransactionsUpdateDto {
  @ApiProperty({
    type: String,
    description: 'transactionExternalId of the transaction',
    default: '630aeeb06997b40d6907c6c0',
    required: true,
  })
  @IsNotEmpty()
  @IsUUID()
  transactionExternalId: string;

  @ApiProperty({
    type: Object,
    description: 'Transaction status',
    required: true,
  })
  @IsObject()
  @IsNotEmpty()
  transactionStatus?: { name: string };
}
