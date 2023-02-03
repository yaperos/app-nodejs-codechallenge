import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetTransactionDto {
  @IsNotEmpty()
  @IsUUID()
  readonly transactionExternalId: string;
}
