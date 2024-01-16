import { ApiProperty } from '@nestjs/swagger';
import { TransactionStatus } from 'src/entities/transaction.entity';

class TransactionStatusObject {
  name: TransactionStatus;
}

export class TransactionOutput {
  @ApiProperty()
  transactionExternalId: string;

  @ApiProperty()
  transactionType: number;

  @ApiProperty()
  transactionStatus: TransactionStatusObject;

  @ApiProperty()
  value: number;

  @ApiProperty()
  createdAt: Date;
}

export class TransactionsOutput {
  @ApiProperty()
  totalCount: number;

  @ApiProperty()
  transactions: TransactionOutput[];
}
