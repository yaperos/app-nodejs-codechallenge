import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class EditTransactionDto {
  @IsString()
  @IsNotEmpty()
  transactionId?: string;

  @IsString()
  @IsNotEmpty()
  currency?: string;

  @Min(0)
  @IsOptional()
  @IsNumber()
  amount?: number;
}
