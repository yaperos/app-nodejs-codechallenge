import { ApiProperty } from '@nestjs/swagger';

export class TransactionTypeDto {
  @ApiProperty({ example: 'Transferencia' })
  name: string;
}

export class TransactionStatusDto {
  @ApiProperty({ example: 'approved', enum: ['pending', 'approved', 'rejected'] })
  name: string;
}

export class TransactionResponseDto {
  @ApiProperty({
    description: 'Unique transaction identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  transactionExternalId: string;

  @ApiProperty({ type: TransactionTypeDto })
  transactionType: TransactionTypeDto;

  @ApiProperty({ type: TransactionStatusDto })
  transactionStatus: TransactionStatusDto;

  @ApiProperty({ description: 'Transaction value', example: 500 })
  value: number;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;
}
