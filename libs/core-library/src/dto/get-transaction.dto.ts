import { ApiProperty } from '@nestjs/swagger';
import { GetTransactionStatusDto } from './get-transaction-status.dto';
import { GetTransactionTypeDto } from './get-transaction-type.dto';

export class GetTransactionDto {
  constructor(
    transactionExternalId: string,
    value: number,
    createdAt: Date,
    transactionStatus: GetTransactionStatusDto,
    transactionType: GetTransactionTypeDto,
  ) {
    this.transactionExternalId = transactionExternalId;
    this.value = value;
    this.createdAt = createdAt;
    this.transactionStatus = new GetTransactionStatusDto(
      transactionStatus.name,
    );
    this.transactionType = new GetTransactionTypeDto(transactionType.name);
  }

  @ApiProperty()
  transactionExternalId: string;

  @ApiProperty()
  transactionType: GetTransactionTypeDto;

  @ApiProperty()
  transactionStatus: GetTransactionStatusDto;

  @ApiProperty()
  value: number;

  @ApiProperty()
  createdAt: Date;
}
