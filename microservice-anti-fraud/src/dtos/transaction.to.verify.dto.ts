import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class TransactionToVerifyDTO {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  readonly transactionExternalId: string;

  @IsNumber()
  @IsNotEmpty()
  readonly value: number;
}
