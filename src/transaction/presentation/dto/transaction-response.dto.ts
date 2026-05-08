import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class TransactionTypeNestedDto {
  @ApiProperty({ example: 'Cuenta a cuenta' })
  name: string;
}

export class TransactionStatusNestedDto {
  @ApiProperty({ example: 'pending', enum: ['pending', 'approved', 'rejected'] })
  name: string;
}

export class TransactionResponseDto {
  @ApiProperty({ format: 'uuid' })
  transactionExternalId: string;

  @ApiProperty({ type: TransactionTypeNestedDto })
  @Type(() => TransactionTypeNestedDto)
  transactionType: TransactionTypeNestedDto;

  @ApiProperty({ type: TransactionStatusNestedDto })
  @Type(() => TransactionStatusNestedDto)
  transactionStatus: TransactionStatusNestedDto;

  @ApiProperty({ example: 120 })
  value: number;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt: Date;
}

export class CreateTransactionResponseDto {
  @ApiProperty({ format: 'uuid' })
  transactionExternalId: string;
}
