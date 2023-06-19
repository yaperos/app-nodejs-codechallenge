import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class TransactionGetDTO {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  transactionExternalId: string;
}
