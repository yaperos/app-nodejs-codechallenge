import { TransactionStatus } from '@app/contracts';
import { ApiProperty } from '@nestjs/swagger';

class NamedDto {
  @ApiProperty()
  name!: string;
}

class TransactionStatusDto {
  @ApiProperty({ enum: TransactionStatus })
  name!: TransactionStatus;
}

export class TransactionResponseDto {
  @ApiProperty({ format: 'uuid' })
  transactionExternalId!: string;

  @ApiProperty({ type: NamedDto })
  transactionType!: NamedDto;

  @ApiProperty({ type: TransactionStatusDto })
  transactionStatus!: TransactionStatusDto;

  @ApiProperty({ example: 120 })
  value!: number;

  @ApiProperty({ type: String, format: 'date-time' })
  createdAt!: string;
}
