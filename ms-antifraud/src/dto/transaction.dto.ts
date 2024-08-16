import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TransactionDTO {
  @IsString()
  @IsNotEmpty()
  readonly transactionExternalId: string;

  @IsNumber()
  @IsNotEmpty()
  readonly value: number;
}
