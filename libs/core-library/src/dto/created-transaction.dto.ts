import { ApiProperty } from '@nestjs/swagger';

export class CreatedTransactionDto {
  constructor(transactionExternalId: string, value: number, createdAt: Date) {
    this.transactionExternalId = transactionExternalId;
    this.value = value;
    this.createdAt = createdAt;
  }

  @ApiProperty()
  transactionExternalId: string;
  @ApiProperty()
  value: number;
  @ApiProperty()
  createdAt: Date;
}
