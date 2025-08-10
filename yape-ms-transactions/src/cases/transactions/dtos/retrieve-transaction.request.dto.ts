import { IsUUID, IsNotEmpty } from 'class-validator';

export class RetrieveTransactionDto {
  @IsNotEmpty()
  @IsUUID()
  transactionId: string;
}
