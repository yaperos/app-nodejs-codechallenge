import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsUUID } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'External ID of the debit account',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  accountExternalIdDebit: string;

  @ApiProperty({
    description: 'External ID of the credit account',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  accountExternalIdCredit: string;

  @ApiProperty({
    description: 'ID of the transfer type',
    example: 1,
  })
  @IsNumber()
  tranferTypeId: number;

  @ApiProperty({
    description: 'Amount to transfer',
    example: 120,
  })
  @IsNumber()
  value: number;
}

export class TransactionResponseDto {
  @ApiProperty({
    description: 'External ID of the transaction',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  transactionExternalId: string;

  @ApiProperty({
    description: 'Transaction type information',
    example: { name: 'TRANSFER' },
  })
  transactionType: {
    name: string;
  };

  @ApiProperty({
    description: 'Transaction status information',
    example: { name: 'APPROVED' },
  })
  transactionStatus: {
    name: string;
  };

  @ApiProperty({
    description: 'Transaction amount',
    example: 120,
  })
  @IsNumber()
  value: number;

  @ApiProperty({
    description: 'Transaction creation date',
    example: '2025-04-21T21:15:06.000Z',
  })
  createdAt: Date;
}
