import { ApiProperty } from '@nestjs/swagger';

export class UpdateTransactionDTO {
  transactionExternalId: string;
  accountExternalIdDebit?: string;
  accountExternalIdCredit?: string;
  tranferTypeId?: number;
  value?: number;
  status: number;
}
