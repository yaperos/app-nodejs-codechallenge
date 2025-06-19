import { ApiProperty } from '@nestjs/swagger';

export class TransactionTypeResponseDto {
  @ApiProperty({
    description: 'Transaction type name',
    example: 'Transfer',
  })
  name: string;
}

export class TransactionStatusResponseDto {
  @ApiProperty({
    description: 'Transaction status name',
    example: 'pending',
  })
  name: string;
}

export class TransactionResponseDto {
  @ApiProperty({
    description: 'Transaction external ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  transactionExternalId: string;

  @ApiProperty({
    description: 'Transaction type',
    type: TransactionTypeResponseDto,
  })
  transactionType: TransactionTypeResponseDto;

  @ApiProperty({
    description: 'Transaction status',
    type: TransactionStatusResponseDto,
  })
  transactionStatus: TransactionStatusResponseDto;

  @ApiProperty({
    description: 'Transaction value',
    example: 120,
  })
  value: number;

  @ApiProperty({
    description: 'Transaction creation date',
    example: '2023-01-01T00:00:00.000Z',
  })
  createdAt: Date;
} 