import {
  IsEmail,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTransactionTypeDto {
  @IsString()
  @IsOptional()
  TransactionTypeId: string;

  @IsString()
  @IsOptional()
  name: string;
}
