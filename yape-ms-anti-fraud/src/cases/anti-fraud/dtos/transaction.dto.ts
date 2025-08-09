import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class TransactionRequestDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  accountExternalIdDebit: string;

  @IsNotEmpty()
  @IsString()
  accountExternalIdCredit: string;

  @IsNotEmpty()
  @IsString()
  transactionStatusName: string;

  @IsNotEmpty()
  @IsNumber()
  transferTypeId: number;

  @IsNotEmpty()
  @IsNumber()
  value: number;

  @IsNotEmpty()
  @IsString()
  createdAt: string;
}
