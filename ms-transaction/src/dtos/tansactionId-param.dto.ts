import { IsNotEmpty } from 'class-validator';

export class TransactionIdParamDto {
  @IsNotEmpty()
  transactionExternalId: string;
}
