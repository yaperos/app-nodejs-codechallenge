import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class TransactionVerifyRequestDto {
  @IsString()
  @IsUUID()
  readonly transactionExternalId: string;

  @IsNumber()
  @IsNotEmpty()
  readonly status: string;
}
