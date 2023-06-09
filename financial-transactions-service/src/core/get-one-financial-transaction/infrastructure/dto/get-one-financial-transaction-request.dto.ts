import { IsUUID } from 'class-validator';

export class GetOneFinancialTransactionRequestDTO {
  @IsUUID()
  transactionExternalId: string;
}
