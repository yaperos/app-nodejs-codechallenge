import { IsString } from 'class-validator';

export class GetTransactionByExternalIdDTO  {
  @IsString()
  readonly transactionExternalId: string;
}