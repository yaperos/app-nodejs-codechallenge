import { IsNotEmpty, IsNumber, IsUUID, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'UUID of the debit account',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsUUID()
  accountExternalIdDebit: string;

  @ApiProperty({
    description: 'UUID of the credit account',
    example: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
  })
  @IsNotEmpty()
  @IsUUID()
  accountExternalIdCredit: string;

  @ApiProperty({
    description: 'Transaction type ID (1: Transferencia, 2: Pago de servicios, 3: Retiro)',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  tranferTypeId: number;

  @ApiProperty({
    description: 'Transaction value. Values > 1000 will be rejected by anti-fraud',
    example: 500,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  value: number;
}
