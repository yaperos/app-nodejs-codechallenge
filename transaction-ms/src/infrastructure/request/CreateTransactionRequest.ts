import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateTransactionRequest {
  @IsString()
  @IsNotEmpty()
  accountExternalIdDebit: string;

  @IsString()
  @IsNotEmpty()
  accountExternalIdCredit: string;

  @IsNumber()
  transferTypeId: number;

  @IsNumber()
  @Min(1)
  value: number;
}