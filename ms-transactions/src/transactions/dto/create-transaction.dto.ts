import { IsNotEmpty, IsUUID, IsInt, Min, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsUUID()
  accountExternalIdDebit: string;

  @IsNotEmpty()
  @IsUUID()
  accountExternalIdCredit: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  transferTypeId: number;

  @IsNotEmpty()
  @IsString()
  transactionStatus: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  value: number;
}