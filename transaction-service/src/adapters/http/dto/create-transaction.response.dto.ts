import { ApiProperty } from '@nestjs/swagger';

class TransactionStatusDto {
  @ApiProperty({ enum: ['pending', 'approved', 'rejected'] })
  name!: 'pending' | 'approved' | 'rejected';
}

export class CreateTransactionResponseDto {
  @ApiProperty({ format: 'uuid' })
  transactionExternalId!: string;

  @ApiProperty({ type: () => TransactionStatusDto })
  transactionStatus!: TransactionStatusDto;

  @ApiProperty({ format: 'date-time' })
  createdAt!: string;
}
