import { IsString, IsUUID, IsNumber, IsPositive, Matches, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateTransactionDto {
  @ApiProperty({
    name: 'accountExternalIdDebit',
    description: 'ID externo de la cuenta desde la cual se debitarán los fondos.',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
    required: true
  })
  @IsNotEmpty()
  @IsUUID(4, { message: 'accountExternalIdDebit must be a valid UUID' })
  accountExternalIdDebit!: string;

  @ApiProperty({
    name: 'accountExternalIdCredit',
    description: 'ID externo de la cuenta a la cual se acreditarán los fondos.',
    example: '987fcdeb-51a2-43d1-b789-123456789abc',
    format: 'uuid',
    required: true
  })
  @IsNotEmpty()
  @IsUUID(4, { message: 'accountExternalIdCredit must be a valid UUID' })
  accountExternalIdCredit!: string;

  @ApiProperty({
    name: 'transactionTypeCode',
    description: 'Codigo del tipo de transferencia (220, 225, 320, 325).',
    example: '220',
    pattern: '^(220|225|320|325)$',
    required: true
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^(220|225|320|325)$/, { 
    message: 'transactionTypeCode must be one of: 220, 225, 320, 325' 
  })
  transactionTypeCode!: string;

  @ApiProperty({
    name: 'amount',
    description: 'Valor monetario de la transacción.',
    example: 100.50,
    type: 'number',
    minimum: 0.01,
    required: true
  })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'amount must be a number with at most 2 decimal places' })
  @IsPositive({ message: 'amount must be a positive number' })
  amount!: number;
}
