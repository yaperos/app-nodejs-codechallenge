import { ApiProperty } from '@nestjs/swagger';

export class TransactionRequest {
  @ApiProperty({ description: 'RequestId' })
  requestId: string;

  @ApiProperty({ description: 'account external debit' })
  accountExternalIdDebit: string;

  @ApiProperty({ description: 'account external credit' })
  accountExternalIdCredit: string;

  @ApiProperty({ description: 'type of transaction' })
  tranferTypeId: number;

  @ApiProperty({ description: 'value of transaction' })
  value: number;
}

class TransactionType {
  @ApiProperty({ description: 'RequestId' })
  name: number;
}

class TransactionStatus {
  @ApiProperty({ description: 'RequestId' })
  name: string;
}

export class StatusResponse {
  @ApiProperty({ description: 'Account external Id Debit' })
  transactionExternalId: string;

  @ApiProperty()
  transactionType: TransactionType;

  @ApiProperty()
  transactionStatus: TransactionStatus;

  @ApiProperty({ description: 'value of transaction' })
  value: number;

  @ApiProperty({ description: 'createdAt of transaction' })
  createdAt: string;
}
