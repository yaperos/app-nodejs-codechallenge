import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class TransactionVerifyDto {
  @IsString()
  @IsUUID()
  readonly transactionExternalId: string;

  @IsNumber()
  @IsNotEmpty()
  readonly value: number;
}
