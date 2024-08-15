import { ApiProperty } from '@nestjs/swagger';

export class TransactionEventDTO {
  transactionExternalId?: string;
  value: number;
}
