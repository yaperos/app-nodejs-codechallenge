import { ApiProperty } from '@nestjs/swagger';

class TransactionTypeDto {
  @ApiProperty()
  name!: string;
}

class TransactionStatusDto {
  @ApiProperty({ enum: ['pending', 'approved', 'rejected'] })
  name!: 'pending' | 'approved' | 'rejected';
}

export class TransactionViewDto {
  @ApiProperty({ format: 'uuid' })
  transactionExternalId!: string;

  @ApiProperty({ type: () => TransactionTypeDto })
  transactionType!: TransactionTypeDto;

  @ApiProperty({ type: () => TransactionStatusDto })
  transactionStatus!: TransactionStatusDto;

  @ApiProperty({ type: Number })
  value!: number;

  @ApiProperty({ format: 'date-time' })
  createdAt!: string;
}
