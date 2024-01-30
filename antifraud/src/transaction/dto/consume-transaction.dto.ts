import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class ConsumeTransactionDto {
  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @Min(1)
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}

export class ConsumeExternalTransactionDto {
  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @IsString()
  @IsNotEmpty()
  account_id_debit: string;

  @IsString()
  @IsNotEmpty()
  account_id_credit: string;

  @Min(1)
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
