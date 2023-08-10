import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CheckTransactionDto {
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  readonly transactionExternalId: string;

  @IsNumber()
  @IsNotEmpty()
  readonly value: number;
}
