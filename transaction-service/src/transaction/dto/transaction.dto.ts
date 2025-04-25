import { ApiProperty } from '@nestjs/swagger';

class TransactionTypeDto {
  @ApiProperty()
  name: string;
}

class TransactionStatusDto {
  @ApiProperty()
  name: string;
}

export class TransactionDto {
  @ApiProperty()
  transactionExternalId: string;

  @ApiProperty({ type: TransactionTypeDto })
  transactionType: TransactionTypeDto;

  @ApiProperty({ type: TransactionStatusDto })
  transactionStatus: TransactionStatusDto;

  @ApiProperty()
  value: number;

  @ApiProperty()
  createdAt: Date;
}
